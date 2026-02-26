'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PermissionsState {
    permissions: string[] | null   // null  = not yet loaded
    isLoading: boolean
    isAdmin: boolean               // true  = show everything, skip checks
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PermissionsContext = createContext<PermissionsState>({
    permissions: null,
    isLoading: true,
    isAdmin: false,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read a cookie value by name from document.cookie */
function getCookie(name: string): string {
    if (typeof document === 'undefined') return ''
    const match = document.cookie.match(
        new RegExp('(?:^|;\\s*)' + name + '\\s*=\\s*([^;]*)')
    )
    return match ? decodeURIComponent(match[1]) : ''
}

const ADMIN_ROLE_NAMES = ['Admin', 'Organization Admin']

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<PermissionsState>({
        permissions: null,
        isLoading: true,
        isAdmin: false,
    })

    useEffect(() => {
        let cancelled = false

        async function fetchPermissions() {
            try {
                const token = getCookie('accessToken')
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

                // No token → not logged in, show nothing restricted
                if (!token) {
                    if (!cancelled) setState({ permissions: [], isLoading: false, isAdmin: false })
                    return
                }

                const res = await fetch(`${API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store', // always fresh, never use browser cache
                })

                // Token invalid / expired
                if (!res.ok) {
                    if (!cancelled) setState({ permissions: [], isLoading: false, isAdmin: false })
                    return
                }

                const profile = await res.json()
                console.log('[PermissionsContext] /auth/profile status:', res.status)
                if (!res.ok) {
                    console.error('[PermissionsContext] profile fetch failed body:', profile)
                }
                console.log('[PermissionsContext] profile payload:', profile)
                const roles: any[] = profile?.data?.roles ?? profile?.roles ?? []

                // Helper: find any arrays in profile that look like permission lists
                const extraPermissionArrays: any[] = []
                const scanForPermissionArrays = (obj: any) => {
                    if (!obj || typeof obj !== 'object') return
                    for (const k of Object.keys(obj)) {
                        try {
                            const v = obj[k]
                            if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') {
                                const first = v[0]
                                if (first && (first.route || first.slug || first.httpMethod || first.action)) {
                                    extraPermissionArrays.push(v)
                                }
                            }
                        } catch { }
                    }
                }

                // scan common locations
                scanForPermissionArrays(profile)
                scanForPermissionArrays(profile?.data)
                scanForPermissionArrays(profile?.data?.permissions)
                scanForPermissionArrays(profile?.data?.allPermissions)

                if (profile?.data?.permissions && Array.isArray(profile.data.permissions)) {
                    extraPermissionArrays.push(profile.data.permissions)
                }
                if (profile?.data?.allPermissions && Array.isArray(profile.data.allPermissions)) {
                    extraPermissionArrays.push(profile.data.allPermissions)
                }

                console.log('[PermissionsContext] found extra permission arrays count:', extraPermissionArrays.length)

                // ── Admin check ──────────────────────────────────────────────────────
                // If the user has any admin role, skip permission filtering entirely.
                const adminFound = roles.some(r =>
                    ADMIN_ROLE_NAMES.includes(r.name) ||
                    String(r.name ?? '').toLowerCase().includes('admin')
                )

                if (adminFound) {
                    if (!cancelled) setState({ permissions: null, isLoading: false, isAdmin: true })
                    return
                }

                // ── Build permission list for non-admin users ────────────────────────
                const apiRoutes: string[] = []

                roles.forEach(role => {
                    role.permissions?.forEach((p: any) => {
                        // DEBUG: log every raw permission to see what backend returns
                        console.log('[PermissionsContext] raw permission:', JSON.stringify(p))

                        if (p.apiRoute) apiRoutes.push(p.apiRoute)
                        if (p.route) apiRoutes.push(p.route)
                        if (p.slug) {
                            apiRoutes.push(p.slug)
                            // Push some common slug variants to increase matching odds
                            const s = String(p.slug)
                            apiRoutes.push(s.replace(/\s+/g, ''))
                            apiRoutes.push(s.replace(/-/g, ':'))
                            apiRoutes.push(s.replace(/[:\-\s]/g, '').toLowerCase())
                        }

                        // Add action and module-action combos as possible tokens
                        if (p.action) apiRoutes.push(String(p.action))
                        if (p.module && p.action) apiRoutes.push(`${String(p.module)} ${String(p.action)}`)

                        // Combined "METHOD /route" token (e.g. "get /centers")
                        if (p.httpMethod && p.route) {
                            apiRoutes.push(`${String(p.httpMethod).toLowerCase()} ${p.route}`)
                        }

                        if (p.module) {
                            // Derive a sensible API path from the permission's module name.
                            // Backend may send values like "Center Module" which would
                            // previously become "/center modules" — incorrect.
                            const modRaw = String(p.module || '').trim().toLowerCase()
                            // Pick the first token (e.g. 'center' from 'center module')
                            const primary = modRaw.split(/\s+/)[0].replace(/[^a-z0-9]/g, '')
                            if (primary) {
                                const path = `/${primary.endsWith('s') ? primary : primary + 's'}`
                                apiRoutes.push(`get ${path}`)
                                apiRoutes.push(path)
                            }
                        }
                    })
                })

                // Also handle any extra permission arrays found on the profile
                extraPermissionArrays.forEach((arr, idx) => {
                    try {
                        console.log(`[PermissionsContext] scanning extraPermissionArrays[${idx}] length=${arr.length}`)
                        arr.forEach((p: any) => {
                            console.log('[PermissionsContext] raw permission (extra):', JSON.stringify(p))

                            // If the array contains plain string slugs like
                            // "MasterApp:Center-Module:Center-List", handle them.
                            if (typeof p === 'string') {
                                const s = String(p)
                                apiRoutes.push(s)
                                apiRoutes.push(s.replace(/\s+/g, ''))
                                apiRoutes.push(s.replace(/-/g, ':'))
                                apiRoutes.push(s.replace(/[:\-\s]/g, '').toLowerCase())
                                return
                            }

                            if (p.apiRoute) apiRoutes.push(p.apiRoute)
                            if (p.route) apiRoutes.push(p.route)
                            if (p.slug) {
                                apiRoutes.push(p.slug)
                                const s = String(p.slug)
                                apiRoutes.push(s.replace(/\s+/g, ''))
                                apiRoutes.push(s.replace(/-/g, ':'))
                                apiRoutes.push(s.replace(/[:\-\s]/g, '').toLowerCase())
                            }
                            if (p.action) apiRoutes.push(String(p.action))
                            if (p.module && p.action) apiRoutes.push(`${String(p.module)} ${String(p.action)}`)
                            if (p.httpMethod && p.route) apiRoutes.push(`${String(p.httpMethod).toLowerCase()} ${p.route}`)
                            if (p.module) {
                                const modRaw = String(p.module || '').trim().toLowerCase()
                                const primary = modRaw.split(/\s+/)[0].replace(/[^a-z0-9]/g, '')
                                if (primary) {
                                    const path = `/${primary.endsWith('s') ? primary : primary + 's'}`
                                    apiRoutes.push(`get ${path}`)
                                    apiRoutes.push(path)
                                }
                            }
                        })
                    } catch { }
                })

                console.log('[PermissionsContext] roles:', roles)
                console.log('[PermissionsContext] FINAL permissions built:', apiRoutes)

                if (!cancelled) {
                    setState({ permissions: apiRoutes, isLoading: false, isAdmin: false })
                }
            } catch (err) {
                console.error('[PermissionsContext] fetch failed:', err)
                if (!cancelled) setState({ permissions: [], isLoading: false, isAdmin: false })
            }
        }

        fetchPermissions()

        return () => { cancelled = true }
    }, []) // run once per mount (= once per page load / navigation)

    return (
        <PermissionsContext.Provider value={state}>
            {children}
        </PermissionsContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePermissionsContext(): PermissionsState {
    return useContext(PermissionsContext)
}
