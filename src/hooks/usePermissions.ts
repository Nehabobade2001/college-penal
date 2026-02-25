import { useState, useEffect } from 'react'

// How long (ms) before the cached permissions are considered stale and re-fetched.
// 2 minutes — short enough to pick up role changes without hammering the backend.
const CACHE_TTL_MS = 2 * 60 * 1000

export function usePermissions(): string[] | null {
    const [permissions, setPermissions] = useState<string[] | null>(null)


    useEffect(() => {
        if (typeof window === 'undefined') return

        const getClientRole = (): string => {
            try {
                const cookieRole = document.cookie.replace(
                    /(?:(?:^|.*;\s*)userRole\s*=\s*([^;]*).*$)|^.*$/,
                    '$1'
                )
                if (cookieRole) return cookieRole.toLowerCase()

                const lsRole =
                    localStorage.getItem('userRole') ||
                    localStorage.getItem('role')

                return lsRole ? lsRole.toLowerCase() : ''
            } catch {
                return ''
            }
        }

        const isAdminUser = (): boolean => {
            try {
                const storedAdmin = JSON.parse(
                    localStorage.getItem('isAdmin') || 'false'
                )
                if (storedAdmin) return true

                const roleNames = JSON.parse(
                    localStorage.getItem('userRoleNames') || '[]'
                ) as string[]

                return roleNames.some(r =>
                    r.toLowerCase().includes('admin')
                )
            } catch {
                return false
            }
        }

        const isCacheValid = (): boolean => {
            try {
                const ts = Number(localStorage.getItem('userPermissions_ts') || '0')
                return ts > 0 && Date.now() - ts < CACHE_TTL_MS
            } catch {
                return false
            }
        }

        const loadPermissions = async () => {
            try {
                // 🔹 1. Admin = unrestricted
                if (isAdminUser() || getClientRole() === 'admin') {
                    setPermissions(null)
                    return
                }

                // 🔹 2. Check localStorage — only use if cache is still fresh (< 2 min)
                const stored = localStorage.getItem('userPermissions')
                if (stored && isCacheValid()) {
                    const parsed = JSON.parse(stored) as string[]
                    setPermissions(parsed)
                    return
                }

                // 🔹 3. Fetch fresh data from backend (cache expired or missing)
                const token = document.cookie.replace(
                    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
                    '$1'
                )

                if (!token) {
                    setPermissions(null)
                    return
                }

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/profile`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                const profile = await res.json()
                const roles: any[] = profile?.data?.roles || []

                const apiRoutes: string[] = []

                roles.forEach(role => {
                    role.permissions?.forEach((p: any) => {
                        if (p.apiRoute) apiRoutes.push(p.apiRoute)
                        if (p.route) apiRoutes.push(p.route)
                        if (p.slug) apiRoutes.push(p.slug)

                        if (p.module) {
                            const mod = String(p.module).trim().toLowerCase()
                            const path = `/${mod.endsWith('s') ? mod : mod + 's'}`
                            apiRoutes.push(`get ${path}`)
                            apiRoutes.push(path)
                        }
                    })
                })

                // 🔹 DEBUG — open browser console to see what permissions are loaded
                console.log('[usePermissions] roles from API:', JSON.stringify(roles, null, 2))
                console.log('[usePermissions] apiRoutes built:', apiRoutes)

                // 🔹 Persist with a timestamp so the cache expires after CACHE_TTL_MS
                localStorage.setItem('userPermissions', JSON.stringify(apiRoutes))
                localStorage.setItem('userPermissions_ts', String(Date.now()))
                localStorage.setItem(
                    'userRoleNames',
                    JSON.stringify(roles.map(r => r.name))
                )
                localStorage.setItem(
                    'isAdmin',
                    JSON.stringify(
                        roles.some(
                            r =>
                                r.name === 'Admin' ||
                                r.name === 'Organization Admin'
                        )
                    )
                )

                console.log('[usePermissions] final stored permissions:', apiRoutes)
                setPermissions(apiRoutes)
            } catch (err) {
                console.error('Permission load failed:', err)
                setPermissions(null)
            }
        }

        loadPermissions()
    }, [])

    return permissions
}