"use client"

import React, { useEffect, useState } from 'react'
import { departmentAPI, categoryAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Department = {
  id: number
  name: string
  code?: string
  description?: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await departmentAPI.list()
      if (res && res.data) setDepartments(res.data)
      else if (Array.isArray(res)) setDepartments(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.list()
      if (res && res.data) setCategories(res.data)
      else if (Array.isArray(res)) setCategories(res)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchDepartments()
    fetchCategories()
  }, [])

  const openEdit = (dep: Department) => {
    router.push(`/masters/departments/new?id=${dep.id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this department?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await departmentAPI.remove(id)
      if (res && (res.success || res.message === undefined)) {
        setMessage('Department deleted')
        await fetchDepartments()
      } else if (res && res.message) {
        setError(res.message)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to delete')
    } finally {
      setActionLoading((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className="p-6 main-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Master - Departments</h1>
        <div className="flex gap-2">
          <Link href="/masters/departments/new">
            <Button className="dashboard-add-btn">Add New Department</Button>
          </Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Departments</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className='overflow-auto'>
            <table className='w-full table-auto border dashboard-table'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 text-left'>S.No</th>
                  <th className='p-2 text-left'>Name</th>
                  <th className='p-2 text-left'>Code</th>
                  <th className='p-2 text-left'>Description</th>
                  <th className='p-2 text-left'>Category</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr><td colSpan={5} className='p-4'>No departments found.</td></tr>
                ) : (
                  departments.map((dep, idx) => (
                    <tr key={dep.id} className='border-t'>
                      <td className='p-2'>{idx + 1}</td>
                      <td className='p-2'>{dep.name}</td>
                      <td className='p-2'>{dep.code || ''}</td>
                      <td className='p-2'>{dep.description || ''}</td>
                      <td className='p-2'>
                        {dep.categoryName ?? (typeof dep.category === 'object' ? (dep.category?.name ?? dep.category?.code ?? JSON.stringify(dep.category)) : dep.category) ?? (categories.find(c => c.id === dep.categoryId)?.name) ?? ''}
                      </td>
                      <td className='p-2 flex gap-2 dashboard-actions'>
                          <Button variant='outline' size='sm' onClick={() => openEdit(dep)} disabled={!!actionLoading[dep.id]}>Edit</Button>
                          <Button variant='destructive' size='sm' onClick={() => handleDelete(dep.id)} disabled={!!actionLoading[dep.id]}>
                            {actionLoading[dep.id] ? '...' : 'Delete'}
                          </Button>
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
