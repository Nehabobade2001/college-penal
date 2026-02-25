'use client'

import React, { useEffect, useState } from 'react'
import { roleAPI, permissionAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

interface Permission {
    id: number
    appName: string
    module: string
    action: string
    slug: string
    description?: string
}

interface PermissionGroup {
    moduleName: string
    permissions: Permission[]
}

export default function RoleFormPage() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [allPermissions, setAllPermissions] = useState<Permission[]>([])
    const [permGroups, setPermGroups] = useState<PermissionGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const router = useRouter()
    const params = useSearchParams()
    const id = params?.get('id') ? Number(params.get('id')) : null

    // Group permissions by module
    const groupPermissions = (perms: Permission[]): PermissionGroup[] => {
        const map: Record<string, Permission[]> = {}
        perms.forEach(p => {
            const key = `${p.appName} — ${p.module}`
            if (!map[key]) map[key] = []
            map[key].push(p)
        })
        return Object.entries(map).map(([moduleName, permissions]) => ({ moduleName, permissions }))
    }

    useEffect(() => {
        const init = async () => {
            setFetching(true)
            try {
                // Load all permissions
                const permRes = await permissionAPI.list()
                const perms: Permission[] = permRes?.data || []
                setAllPermissions(perms)
                setPermGroups(groupPermissions(perms))

                // If editing, load existing role
                if (id) {
                    const roleRes = await roleAPI.getById(id)
                    const role = roleRes?.data
                    if (role) {
                        setName(role.name || '')
                        setDescription(role.description || '')
                        const existingIds = new Set<number>(
                            (role.permissions || []).map((p: any) => p.id)
                        )
                        setSelectedIds(existingIds)
                    }
                }
            } catch {
                setError('Failed to load data')
            } finally {
                setFetching(false)
            }
        }
        init()
    }, [id])

    const togglePermission = (permId: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(permId)) next.delete(permId)
            else next.add(permId)
            return next
        })
    }

    const toggleGroup = (group: PermissionGroup) => {
        const allSelected = group.permissions.every(p => selectedIds.has(p.id))
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (allSelected) {
                group.permissions.forEach(p => next.delete(p.id))
            } else {
                group.permissions.forEach(p => next.add(p.id))
            }
            return next
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) { setError('Role name is required'); return }
        setError('')
        setMessage('')
        setLoading(true)
        try {
            const payload = {
                name: name.trim(),
                description: description.trim(),
                permissionIds: Array.from(selectedIds),
            }
            if (id) {
                await roleAPI.update(id, payload)
            } else {
                await roleAPI.create(payload)
            }
            setMessage('Saved successfully')
            router.push('/administration/roles')
        } catch {
            setError('Failed to save role')
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
                            {id ? 'Edit Role' : 'Create Role'}
                        </h1>
                        <p className='text-sm text-gray-500 mt-1'>
                            {id ? 'Update role details and permissions' : 'Create a new role and assign permissions to it'}
                        </p>
                    </div>
                </div>

                {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
                {message && <div className='mb-4 p-3 bg-green-100 text-green-800 rounded'>{message}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Role Details */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                        <div className='md:col-span-2'>
                            <h2 className='text-lg font-semibold text-dark dark:text-white mb-1'>Role Details</h2>
                            <p className='text-sm text-gray-500 mb-4'>Basic information about this role</p>
                        </div>
                        <div>
                            <label className='block mb-2 text-sm form-label'>Role Name <span className='text-red-500'>*</span></label>
                            <input
                                className='form-input'
                                placeholder='e.g. Center Manager'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm form-label'>Description</label>
                            <input
                                className='form-input'
                                placeholder='Brief description of this role'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className='mb-6'>
                        <h2 className='text-lg font-semibold text-dark dark:text-white mb-1'>Permissions</h2>
                        <p className='text-sm text-gray-500 mb-4'>
                            Select which permissions this role should have. Use module checkboxes to select/deselect all in a group.
                            <span className='ml-2 text-blue-500 font-medium'>{selectedIds.size} selected</span>
                        </p>

                        {permGroups.length === 0 ? (
                            <div className='p-6 text-center text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg'>
                                No permissions available. <a href='/administration/permissions/new' className='text-blue-500 underline'>Create permissions first.</a>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {permGroups.map((group) => {
                                    const allChecked = group.permissions.every(p => selectedIds.has(p.id))
                                    const someChecked = group.permissions.some(p => selectedIds.has(p.id))
                                    return (
                                        <div key={group.moduleName} className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
                                            {/* Group Header */}
                                            <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/60'>
                                                <input
                                                    type='checkbox'
                                                    id={`group-${group.moduleName}`}
                                                    checked={allChecked}
                                                    ref={el => { if (el) el.indeterminate = !allChecked && someChecked }}
                                                    onChange={() => toggleGroup(group)}
                                                    className='w-4 h-4 accent-blue-600 cursor-pointer'
                                                />
                                                <label
                                                    htmlFor={`group-${group.moduleName}`}
                                                    className='text-sm font-semibold text-dark dark:text-white cursor-pointer'
                                                >
                                                    {group.moduleName}
                                                </label>
                                                <span className='ml-auto text-xs text-gray-400'>
                                                    {group.permissions.filter(p => selectedIds.has(p.id)).length}/{group.permissions.length}
                                                </span>
                                            </div>

                                            {/* Individual Permissions */}
                                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 divide-x-0'>
                                                {group.permissions.map(perm => (
                                                    <label
                                                        key={perm.id}
                                                        className='flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors border-t border-gray-100 dark:border-gray-800'
                                                    >
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedIds.has(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className='mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0'
                                                        />
                                                        <div>
                                                            <p className='text-sm font-medium text-dark dark:text-white'>{perm.action}</p>
                                                            {perm.description && (
                                                                <p className='text-xs text-gray-400 mt-0.5'>{perm.description}</p>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className='flex gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <Button type='submit' className='dashboard-add-btn' disabled={loading}>
                            {loading ? 'Saving...' : id ? 'Update Role' : 'Create Role'}
                        </Button>
                        <Button variant='outline' type='button' onClick={() => router.push('/administration/roles')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
