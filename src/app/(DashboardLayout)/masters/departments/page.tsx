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
  categoryName?: string
  category?: any
  categoryId?: number
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
    } catch (e) { }
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
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Master – Departments</h1>
        <Link href='/masters/departments/new'>
          <Button className='dashboard-add-btn'>Add New Department</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Departments</p>

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Name</th>
                <th className='listing-th'>Code</th>
                <th className='listing-th'>Description</th>
                <th className='listing-th'>Category</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr><td colSpan={6} className='listing-empty'>No departments found.</td></tr>
              ) : (
                departments.map((dep, idx) => (
                  <tr key={dep.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{dep.name}</td>
                    <td className='listing-td'>{dep.code || ''}</td>
                    <td className='listing-td'>{dep.description || ''}</td>
                    <td className='listing-td'>
                      {dep.categoryName ?? (typeof dep.category === 'object' ? (dep.category?.name ?? dep.category?.code ?? JSON.stringify(dep.category)) : dep.category) ?? (categories.find(c => c.id === dep.categoryId)?.name) ?? ''}
                    </td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(dep)} disabled={!!actionLoading[dep.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(dep.id)} disabled={!!actionLoading[dep.id]}>{actionLoading[dep.id] ? '...' : 'Delete'}</Button>
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
