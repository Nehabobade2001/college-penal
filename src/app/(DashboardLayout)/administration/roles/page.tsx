'use client'

import React, { useEffect, useState } from 'react'
import { roleAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Role {
    id: number
    name: string
    description?: string
    permissionCount?: number
    status?: string
}

export default function RolesListPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    const fetchRoles = async () => {
        setLoading(true)
        try {
            // If client role stored as franchise, request all roles from backend
            const storedRole = (typeof window !== 'undefined')
                ? (localStorage.getItem('userRole') || localStorage.getItem('role') || localStorage.getItem('usertype') || localStorage.getItem('userType') || '')
                : ''
            const isFranchise = String(storedRole).toLowerCase() === 'franchise'
            const res = await roleAPI.list(isFranchise ? { all: true } : undefined)
            setRoles(res?.data || [])
        } catch {
            setError('Failed to load roles')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchRoles() }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this role?')) return
        try {
            await roleAPI.remove(id)
            setRoles(prev => prev.filter(r => r.id !== id))
        } catch {
            alert('Failed to delete role')
        }
    }

    return (
        <div className='p-6 main-dashboard'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-semibold text-dark dark:text-white'>Roles</h1>
                    <p className='text-sm text-gray-500 mt-1'>Manage roles and their associated permissions</p>
                </div>
                <Link href='/administration/roles/new'>
                    <Button className='dashboard-add-btn'>+ Add Role</Button>
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
                                <th className='text-left py-3 px-4 form-label font-semibold'>Name</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>Description</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>Permissions</th>
                                <th className='text-left py-3 px-4 form-label font-semibold'>Status</th>
                                <th className='text-right py-3 px-4 form-label font-semibold'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='py-8 text-center text-gray-400'>No roles found. Create your first role.</td>
                                </tr>
                            ) : (
                                roles.map((role, idx) => (
                                    <tr key={role.id} className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'>
                                        <td className='py-3 px-4 text-gray-500 dark:text-gray-400'>{idx + 1}</td>
                                        <td className='py-3 px-4'>
                                            <span className='font-medium text-dark dark:text-white'>{role.name}</span>
                                        </td>
                                        <td className='py-3 px-4 text-gray-500 dark:text-gray-400'>{role.description || '—'}</td>
                                        <td className='py-3 px-4'>
                                            <span className='inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full'>
                                                {role.permissionCount ?? 0} permissions
                                            </span>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${role.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {role.status || 'active'}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4 text-right'>
                                            <div className='flex gap-2 justify-end'>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={() => router.push(`/administration/roles/new?id=${role.id}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    className='text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                                                    onClick={() => handleDelete(role.id)}
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
