"use client"

import React, { useEffect, useState } from 'react'
import { programAPI, departmentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Program = {
  id: number
  name: string
  code?: string
  description?: string
  duration?: number
  durationType?: string
  department?: any
  departmentId?: number
  status?: string
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const res = await programAPI.list()
      if (res && res.data) setPrograms(res.data)
      else if (Array.isArray(res)) setPrograms(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load programs')
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.list()
      if (res && res.data) setDepartments(res.data)
      else if (Array.isArray(res)) setDepartments(res)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchPrograms()
    fetchDepartments()
  }, [])

  const openEdit = (p: Program) => {
    router.push(`/masters/programs/new?id=${p.id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this program?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await programAPI.remove(id)
      if (res && (res.success || res.message === undefined)) {
        setMessage('Program deleted')
        await fetchPrograms()
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
        <h1 className="text-2xl font-semibold text-white">Master - Programs</h1>
        <div className="flex gap-2">
          <Link href="/masters/programs/new">
            <Button className="dashboard-add-btn">Add New Program</Button>
          </Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Programs</h2>
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
                  <th className='p-2 text-left'>Duration</th>
                  <th className='p-2 text-left'>Department</th>
                  <th className='p-2 text-left'>Status</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.length === 0 ? (
                  <tr><td colSpan={7} className='p-4'>No programs found.</td></tr>
                ) : (
                  programs.map((p, idx) => (
                    <tr key={p.id} className='border-t'>
                      <td className='p-2'>{idx + 1}</td>
                      <td className='p-2'>{p.name}</td>
                      <td className='p-2'>{p.code || ''}</td>
                      <td className='p-2'>{p.duration ? `${p.duration} ${p.durationType ?? ''}` : ''}</td>
                      <td className='p-2'>{p.department?.name ?? (typeof p.department === 'object' ? (p.department?.name ?? JSON.stringify(p.department)) : p.department) ?? (departments.find(d => d.id === p.departmentId)?.name) ?? ''}</td>
                      <td className='p-2'>{p.status || ''}</td>
                      <td className='p-2 flex gap-2 dashboard-actions'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(p)} disabled={!!actionLoading[p.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(p.id)} disabled={!!actionLoading[p.id]}>
                          {actionLoading[p.id] ? '...' : 'Delete'}
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
