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
    } catch (e) { }
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
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Master – Programs</h1>
        <Link href='/masters/programs/new'>
          <Button className='dashboard-add-btn'>Add New Program</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Programs</p>

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
                <th className='listing-th'>Duration</th>
                <th className='listing-th'>Department</th>
                <th className='listing-th'>Status</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr><td colSpan={7} className='listing-empty'>No programs found.</td></tr>
              ) : (
                programs.map((p, idx) => (
                  <tr key={p.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{p.name}</td>
                    <td className='listing-td'>{p.code || ''}</td>
                    <td className='listing-td'>{p.duration ? `${p.duration} ${p.durationType ?? ''}` : ''}</td>
                    <td className='listing-td'>{p.department?.name ?? (typeof p.department === 'object' ? (p.department?.name ?? JSON.stringify(p.department)) : p.department) ?? (departments.find(d => d.id === p.departmentId)?.name) ?? ''}</td>
                    <td className='listing-td'>
                      {p.status ? (
                        <span className={p.status === 'Active' || p.status === 'active' ? 'listing-badge-active' : 'listing-badge-inactive'}>{p.status}</span>
                      ) : ''}
                    </td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(p)} disabled={!!actionLoading[p.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(p.id)} disabled={!!actionLoading[p.id]}>{actionLoading[p.id] ? '...' : 'Delete'}</Button>
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
