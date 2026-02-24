"use client"

import React, { useEffect, useState } from 'react'
import { specializationAPI, programAPI, departmentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Specialization = {
  id: number
  name: string
  code?: string
  description?: string
  programId?: number
  departmentId?: number
  program?: any
  department?: any
}

export default function SpecializationsPage() {
  const [items, setItems] = useState<Specialization[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await specializationAPI.list()
      if (res && res.data) setItems(res.data)
      else if (Array.isArray(res)) setItems(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load specializations')
    } finally { setLoading(false) }
  }

  const fetchDepsAndPrograms = async () => {
    try {
      const p = await programAPI.list()
      if (p && p.data) setPrograms(p.data)
      else if (Array.isArray(p)) setPrograms(p)
    } catch (e) {}

    try {
      const d = await departmentAPI.list()
      if (d && d.data) setDepartments(d.data)
      else if (Array.isArray(d)) setDepartments(d)
    } catch (e) {}
  }

  useEffect(() => { fetchItems(); fetchDepsAndPrograms() }, [])

  const openEdit = (s: Specialization) => router.push(`/masters/specializations/new?id=${s.id}`)

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this specialization?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await specializationAPI.remove(id)
      if (res && (res.success || res.message === undefined)) { setMessage('Deleted'); await fetchItems() }
      else if (res && res.message) setError(res.message)
    } catch (err) { console.error(err); setError('Failed to delete') }
    finally { setActionLoading((s) => ({ ...s, [id]: false })) }
  }

  return (
    <div className="p-6 main-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Master - Specializations</h1>
        <div className="flex gap-2">
          <Link href="/masters/specializations/new"><Button className="dashboard-add-btn">Add New Specialization</Button></Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Specializations</h2>
        {loading ? <div>Loading...</div> : (
          <div className='overflow-auto'>
            <table className='w-full table-auto border dashboard-table'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 text-left'>S.No</th>
                  <th className='p-2 text-left'>Name</th>
                  <th className='p-2 text-left'>Code</th>
                  <th className='p-2 text-left'>Program</th>
                  <th className='p-2 text-left'>Department</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={6} className='p-4'>No specializations found.</td></tr>
                ) : (
                  items.map((it, idx) => (
                    <tr key={it.id} className='border-t'>
                      <td className='p-2'>{idx + 1}</td>
                      <td className='p-2'>{it.name}</td>
                      <td className='p-2'>{it.code || ''}</td>
                      <td className='p-2'>{it.program?.name ?? (programs.find(p=>p.id===it.programId)?.name) ?? ''}</td>
                      <td className='p-2'>{it.department?.name ?? (departments.find(d=>d.id===it.departmentId)?.name) ?? ''}</td>
                      <td className='p-2 flex gap-2 dashboard-actions'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(it)} disabled={!!actionLoading[it.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(it.id)} disabled={!!actionLoading[it.id]}>{actionLoading[it.id] ? '...' : 'Delete'}</Button>
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
