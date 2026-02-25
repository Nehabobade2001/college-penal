'use client'

import React, { useEffect, useState } from 'react'
import { permissionAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Permission {
    id: number
    appName: string
    module: string
    action: string
    slug: string
    description?: string
}

export default function PermissionsListPage() {
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    const fetchPermissions = async () => {
        setLoading(true)
        try {
            const res = await permissionAPI.list()
            setPermissions(res?.data || [])
        } catch {
            setError('Failed to load permissions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPermissions() }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this permission?')) return
        try {
            await permissionAPI.remove(id)
            setPermissions(prev => prev.filter(p => p.id !== id))
        } catch {
            alert('Failed to delete permission')
        }
    }

    return (
        <div className='p-6 main-dashboard'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-semibold text-dark dark:text-white'>Permissions</h1>
                    <p className='text-sm text-gray-500 mt-1'>Manage all system permissions that can be assigned to roles</p>
                </div>
                <Link href='/administration/permissions/new'>
                    <Button className='dashboard-add-btn'>+ Add Permission</Button>
                </Link>
            </div>

            {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

            {loading ? (
                <div className='p-8 text-center text-gray-400'>Loading...</div>
            ) : (
                <div className='form-card overflow-auto'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-gray-200 dark:border-gray-700'>
                                <th className='text-left py-3 px-4 form-label font-semibold'>#</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>App</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>Module</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>Action</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>Slug</th>
                                <th className='text-right py-3 px-4 form-label font-semibold'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='py-8 text-center text-gray-400'>No permissions found. Create your first permission.</td>
                                </tr>
                            ) : (
                                permissions.map((perm, idx) => (
                                    <tr key={perm.id} className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'>
                                        <td className='py-3 px-4 text-gray-500 dark:text-gray-400'>{idx + 1}</td>
                                        <td className='py-3 px-4'>
                                            <span className='inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium px-2 py-1 rounded-full'>
                                                {perm.appName}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 font-medium text-dark dark:text-white'>{perm.module}</td>
                                        <td className='py-3 px-4'>
                                            <span className='inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full'>
                                                {perm.action}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs'>{perm.slug}</td>
                                        <td className='py-3 px-4 text-right'>
                                            <div className='flex gap-2 justify-end'>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={() => router.push(`/administration/permissions/new?id=${perm.id}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    className='text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                                                    onClick={() => handleDelete(perm.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
