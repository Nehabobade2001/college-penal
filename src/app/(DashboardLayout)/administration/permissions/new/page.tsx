'use client'

import React, { useEffect, useState } from 'react'
import { permissionAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const APP_NAMES = ['MasterApp', 'TaskManagement', 'MaterialManagement', 'VehicleManagement'] as const

// All known API routes extracted from backend controllers + postman collection
const API_ROUTES: { method: string; route: string; label: string }[] = [
    // Auth
    { method: 'POST', route: '/auth/admin/request-otp', label: 'Admin - Request OTP' },
    { method: 'POST', route: '/auth/admin/verify-otp', label: 'Admin - Verify OTP & Login' },
    { method: 'GET', route: '/auth/admin/dashboard', label: 'Admin - Dashboard' },
    { method: 'POST', route: '/auth/franchise/request-otp', label: 'Franchise - Request OTP' },
    { method: 'POST', route: '/auth/franchise/verify-otp', label: 'Franchise - Verify OTP & Login' },
    { method: 'GET', route: '/auth/franchise/dashboard', label: 'Franchise - Dashboard' },
    { method: 'POST', route: '/auth/student/request-otp', label: 'Student - Request OTP' },
    { method: 'POST', route: '/auth/student/verify-otp', label: 'Student - Verify OTP & Login' },
    { method: 'GET', route: '/auth/student/dashboard', label: 'Student - Dashboard' },
    { method: 'GET', route: '/auth/profile', label: 'Get Profile' },
    { method: 'POST', route: '/auth/forgot-password', label: 'Forgot Password' },
    { method: 'POST', route: '/auth/reset-password', label: 'Reset Password' },
    { method: 'POST', route: '/auth/logout', label: 'Logout' },
    // Users
    { method: 'GET', route: '/user/:id', label: 'Get User by ID' },
    { method: 'POST', route: '/user/all', label: 'Get All Users' },
    { method: 'POST', route: '/user/create', label: 'Create User' },
    { method: 'POST', route: '/user/validate', label: 'Validate User' },
    { method: 'POST', route: '/user/user-hierarchy', label: 'User Hierarchy' },
    // Categories
    { method: 'GET', route: '/categories', label: 'List Categories' },
    { method: 'POST', route: '/categories', label: 'Create Category' },
    { method: 'GET', route: '/categories/:id', label: 'Get Category' },
    { method: 'PUT', route: '/categories/:id', label: 'Update Category' },
    { method: 'DELETE', route: '/categories/:id', label: 'Delete Category' },
    // Departments
    { method: 'GET', route: '/departments', label: 'List Departments' },
    { method: 'POST', route: '/departments', label: 'Create Department' },
    { method: 'GET', route: '/departments/:id', label: 'Get Department' },
    { method: 'PUT', route: '/departments/:id', label: 'Update Department' },
    { method: 'DELETE', route: '/departments/:id', label: 'Delete Department' },
    // Programs
    { method: 'GET', route: '/programs', label: 'List Programs' },
    { method: 'POST', route: '/programs', label: 'Create Program' },
    { method: 'GET', route: '/programs/:id', label: 'Get Program' },
    { method: 'PUT', route: '/programs/:id', label: 'Update Program' },
    { method: 'DELETE', route: '/programs/:id', label: 'Delete Program' },
    // Streams
    { method: 'GET', route: '/streams', label: 'List Streams' },
    { method: 'POST', route: '/streams', label: 'Create Stream' },
    { method: 'GET', route: '/streams/:id', label: 'Get Stream' },
    { method: 'PUT', route: '/streams/:id', label: 'Update Stream' },
    { method: 'DELETE', route: '/streams/:id', label: 'Delete Stream' },
    // Subjects
    { method: 'GET', route: '/subjects', label: 'List Subjects' },
    { method: 'POST', route: '/subjects', label: 'Create Subject' },
    { method: 'GET', route: '/subjects/:id', label: 'Get Subject' },
    { method: 'PUT', route: '/subjects/:id', label: 'Update Subject' },
    { method: 'DELETE', route: '/subjects/:id', label: 'Delete Subject' },
    // Specializations
    { method: 'GET', route: '/specializations', label: 'List Specializations' },
    { method: 'POST', route: '/specializations', label: 'Create Specialization' },
    { method: 'GET', route: '/specializations/:id', label: 'Get Specialization' },
    { method: 'PUT', route: '/specializations/:id', label: 'Update Specialization' },
    { method: 'DELETE', route: '/specializations/:id', label: 'Delete Specialization' },
    // Addresses
    { method: 'GET', route: '/addresses', label: 'List Addresses' },
    { method: 'POST', route: '/addresses', label: 'Create Address' },
    { method: 'GET', route: '/addresses/:id', label: 'Get Address' },
    { method: 'PUT', route: '/addresses/:id', label: 'Update Address' },
    { method: 'DELETE', route: '/addresses/:id', label: 'Delete Address' },
    // Centers
    { method: 'GET', route: '/centers', label: 'List Centers' },
    { method: 'POST', route: '/centers', label: 'Create Center' },
    { method: 'GET', route: '/centers/:id', label: 'Get Center' },
    { method: 'PUT', route: '/centers/:id', label: 'Update Center' },
    { method: 'PATCH', route: '/centers/:id/activate', label: 'Activate Center' },
    { method: 'PATCH', route: '/centers/:id/deactivate', label: 'Deactivate Center' },
    // Students
    { method: 'GET', route: '/students', label: 'List Students' },
    { method: 'POST', route: '/students', label: 'Create Student' },
    { method: 'GET', route: '/students/:id', label: 'Get Student' },
    { method: 'PUT', route: '/students/:id', label: 'Update Student' },
    { method: 'PATCH', route: '/students/:id/activate', label: 'Activate Student' },
    { method: 'PATCH', route: '/students/:id/deactivate', label: 'Deactivate Student' },
    // Roles
    { method: 'GET', route: '/roles', label: 'List Roles' },
    { method: 'POST', route: '/roles', label: 'Create Role' },
    { method: 'GET', route: '/roles/:id', label: 'Get Role' },
    { method: 'PUT', route: '/roles/:id', label: 'Update Role' },
    { method: 'DELETE', route: '/roles/:id', label: 'Delete Role' },
    // Permissions
    { method: 'GET', route: '/permissions', label: 'List Permissions' },
    { method: 'POST', route: '/permissions', label: 'Create Permission' },
    { method: 'GET', route: '/permissions/:id', label: 'Get Permission' },
    { method: 'PUT', route: '/permissions/:id', label: 'Update Permission' },
    { method: 'DELETE', route: '/permissions/:id', label: 'Delete Permission' },
    // Files
    { method: 'POST', route: '/files/upload', label: 'Upload File' },
    // Fees
    { method: 'GET', route: '/fees', label: 'List Fees' },
    { method: 'POST', route: '/fees', label: 'Create Fee' },
    { method: 'GET', route: '/fees/:id', label: 'Get Fee' },
    { method: 'PUT', route: '/fees/:id', label: 'Update Fee' },
    { method: 'DELETE', route: '/fees/:id', label: 'Delete Fee' },
    // Results
    { method: 'GET', route: '/results', label: 'List Results' },
    { method: 'POST', route: '/results', label: 'Create Result' },
    { method: 'GET', route: '/results/:id', label: 'Get Result' },
    { method: 'PUT', route: '/results/:id', label: 'Update Result' },
    { method: 'DELETE', route: '/results/:id', label: 'Delete Result' },
    // Courses
    { method: 'GET', route: '/courses', label: 'List Courses' },
    { method: 'POST', route: '/courses', label: 'Create Course' },
    { method: 'GET', route: '/courses/:id', label: 'Get Course' },
    { method: 'PUT', route: '/courses/:id', label: 'Update Course' },
    { method: 'DELETE', route: '/courses/:id', label: 'Delete Course' },
]

const METHOD_COLORS: Record<string, string> = {
    GET: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export default function PermissionFormPage() {
    const [appName, setAppName] = useState('')
    const [module, setModule] = useState('')
    const [action, setAction] = useState('')
    const [description, setDescription] = useState('')
    const [apiRoute, setApiRoute] = useState('')   // new field
    const [routeSearch, setRouteSearch] = useState('')
    const [showRouteDropdown, setShowRouteDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const router = useRouter()
    const params = useSearchParams()
    const id = params?.get('id') ? Number(params.get('id')) : null

    const filteredRoutes = API_ROUTES.filter(r =>
        routeSearch.trim() === '' ||
        r.route.toLowerCase().includes(routeSearch.toLowerCase()) ||
        r.label.toLowerCase().includes(routeSearch.toLowerCase()) ||
        r.method.toLowerCase().includes(routeSearch.toLowerCase())
    )

    useEffect(() => {
        if (!id) return
        const loadPermission = async () => {
            setFetching(true)
            try {
                const res = await permissionAPI.getById(id)
                const perm = res?.data
                if (perm) {
                    setAppName(perm.appName || '')
                    setModule(perm.module || '')
                    setAction(perm.action || '')
                    setDescription(perm.description || '')
                    // Reconstruct the combined "METHOD /route" string from DB fields
                    const combined = perm.httpMethod && perm.route
                        ? `${perm.httpMethod} ${perm.route}`
                        : ''
                    setApiRoute(combined)
                    setRouteSearch(combined)
                }
            } catch {
                setError('Failed to load permission')
            } finally {
                setFetching(false)
            }
        }
        loadPermission()
    }, [id])

    const validate = () => {
        const e: Record<string, string> = {}
        if (!appName) e.appName = 'App name is required'
        if (!module.trim()) e.module = 'Module is required'
        if (!action.trim()) e.action = 'Action is required'
        if (!description.trim()) e.description = 'Description is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSelectRoute = (r: typeof API_ROUTES[number]) => {
        setApiRoute(`${r.method} ${r.route}`)
        setRouteSearch(`${r.method} ${r.route}`)
        setShowRouteDropdown(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) { setError('Please fix the errors above'); return }
        setError('')
        setMessage('')
        setLoading(true)
        try {
            // Split "METHOD /route" into separate fields for backend
            const routeParts = apiRoute.trim().split(' ')
            const httpMethod = routeParts.length >= 2 ? routeParts[0].toUpperCase() : null
            const route = routeParts.length >= 2 ? routeParts.slice(1).join(' ') : null

            const payload = {
                appName,
                module: module.trim(),
                action: action.trim(),
                description: description.trim(),
                httpMethod: httpMethod || null,
                route: route || null,
            }
            if (id) {
                await permissionAPI.update(id, payload)
            } else {
                await permissionAPI.create(payload)
            }
            setMessage('Saved successfully')
            router.push('/administration/permissions')
        } catch {
            setError('Failed to save permission')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return <div className='p-8 text-center text-gray-400'>Loading...</div>
    }

    return (
        <div className='p-6 main-dashboard'>
            <div className='form-card'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h1 className='text-2xl font-semibold text-dark dark:text-white'>
                            {id ? 'Edit Permission' : 'Create Permission'}
                        </h1>
                        <p className='text-sm text-gray-500 mt-1'>
                            Permissions are auto-slugged as <code className='bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs'>AppName:Module:Action</code>
                        </p>
                    </div>
                </div>

                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                {message && <div className='mb-4 p-3 bg-green-100 text-green-800 rounded'>{message}</div>}

                <form onSubmit={handleSubmit} className='max-w-2xl'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='md:col-span-2'>
                            <h2 className='text-lg font-semibold text-dark dark:text-white mb-1'>Permission Details</h2>
                            <p className='text-sm text-gray-500 mb-4'>
                                The slug is automatically generated from App Name + Module + Action.
                            </p>
                        </div>

                        {/* App Name */}
                        <div>
                            <label className='block mb-2 text-sm form-label'>
                                App Name <span className='text-red-500'>*</span>
                            </label>
                            <select
                                className='form-select'
                                value={appName}
                                onChange={e => setAppName(e.target.value)}
                            >
                                <option value='' disabled>Select App</option>
                                {APP_NAMES.map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                            {errors.appName && <div className='text-sm text-red-400 mt-1'>{errors.appName}</div>}
                        </div>

                        {/* Module */}
                        <div>
                            <label className='block mb-2 text-sm form-label'>
                                Module <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='form-input'
                                placeholder='e.g. Student, Center, Role'
                                value={module}
                                onChange={e => setModule(e.target.value)}
                            />
                            {errors.module && <div className='text-sm text-red-400 mt-1'>{errors.module}</div>}
                        </div>

                        {/* Action */}
                        <div>
                            <label className='block mb-2 text-sm form-label'>
                                Action <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='form-input'
                                placeholder='e.g. Read, Create, Update, Delete'
                                value={action}
                                onChange={e => setAction(e.target.value)}
                            />
                            {errors.action && <div className='text-sm text-red-400 mt-1'>{errors.action}</div>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block mb-2 text-sm form-label'>
                                Description <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='form-input'
                                placeholder='What does this permission allow?'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            {errors.description && <div className='text-sm text-red-400 mt-1'>{errors.description}</div>}
                        </div>

                        {/* API Route — searchable dropdown */}
                        <div className='md:col-span-2 relative'>
                            <label className='block mb-2 text-sm form-label'>
                                API Route
                                <span className='ml-2 text-xs text-gray-400 font-normal'>(optional — link this permission to a backend endpoint)</span>
                            </label>
                            <div className='relative'>
                                <input
                                    className='form-input pr-10'
                                    placeholder='Search or select an API route…'
                                    value={routeSearch}
                                    onChange={e => {
                                        setRouteSearch(e.target.value)
                                        setApiRoute(e.target.value)
                                        setShowRouteDropdown(true)
                                    }}
                                    onFocus={() => setShowRouteDropdown(true)}
                                    autoComplete='off'
                                />
                                {/* Clear button */}
                                {routeSearch && (
                                    <button
                                        type='button'
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                        onClick={() => { setApiRoute(''); setRouteSearch(''); setShowRouteDropdown(false) }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Dropdown list */}
                            {showRouteDropdown && (
                                <div
                                    className='absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto'
                                    onMouseDown={e => e.preventDefault()} // keep focus on input
                                >
                                    {filteredRoutes.length === 0 ? (
                                        <div className='px-4 py-3 text-sm text-gray-400'>No routes match your search</div>
                                    ) : (
                                        filteredRoutes.map((r, i) => (
                                            <button
                                                key={i}
                                                type='button'
                                                className='w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                                                onClick={() => handleSelectRoute(r)}
                                            >
                                                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded font-mono flex-shrink-0 ${METHOD_COLORS[r.method] || 'bg-gray-100 text-gray-700'}`}>
                                                    {r.method}
                                                </span>
                                                <span className='font-mono text-sm text-dark dark:text-white'>{r.route}</span>
                                                <span className='ml-auto text-xs text-gray-400 truncate'>{r.label}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Selected route display */}
                            {apiRoute && !showRouteDropdown && (() => {
                                const parts = apiRoute.split(' ')
                                const method = parts[0]
                                const route = parts.slice(1).join(' ')
                                const matched = API_ROUTES.find(r => `${r.method} ${r.route}` === apiRoute)
                                return (
                                    <div className='mt-2 flex items-center gap-2'>
                                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded font-mono ${METHOD_COLORS[method] || 'bg-gray-100 text-gray-700'}`}>
                                            {method}
                                        </span>
                                        <span className='text-sm font-mono text-dark dark:text-white'>{route}</span>
                                        {matched && <span className='text-xs text-gray-400'>— {matched.label}</span>}
                                    </div>
                                )
                            })()}
                        </div>

                        {/* Slug Preview */}
                        {appName && module && action && (
                            <div className='md:col-span-2'>
                                <label className='block mb-2 text-sm form-label'>Generated Slug (preview)</label>
                                <div className='form-input bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-mono text-sm select-all'>
                                    {appName}:{module}:{action}
                                </div>
                                <p className='text-xs text-gray-400 mt-1'>This will be auto-formatted by the server</p>
                            </div>
                        )}
                    </div>

                    <div className='flex gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <Button type='submit' className='dashboard-add-btn' disabled={loading}>
                            {loading ? 'Saving...' : id ? 'Update Permission' : 'Create Permission'}
                        </Button>
                        <Button variant='outline' type='button' onClick={() => router.push('/administration/permissions')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>

            {/* Close dropdown on outside click */}
            {showRouteDropdown && (
                <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowRouteDropdown(false)}
                />
            )}
        </div>
    )
}
