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
    } catch (e) { }

    try {
      const d = await departmentAPI.list()
      if (d && d.data) setDepartments(d.data)
      else if (Array.isArray(d)) setDepartments(d)
    } catch (e) { }
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
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Master – Specializations</h1>
        <Link href='/masters/specializations/new'>
          <Button className='dashboard-add-btn'>Add New Specialization</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Specializations</p>

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
                <th className='listing-th'>Program</th>
                <th className='listing-th'>Department</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className='listing-empty'>No specializations found.</td></tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{it.name}</td>
                    <td className='listing-td'>{it.code || ''}</td>
                    <td className='listing-td'>{it.program?.name ?? (programs.find(p => p.id === it.programId)?.name) ?? ''}</td>
                    <td className='listing-td'>{it.department?.name ?? (departments.find(d => d.id === it.departmentId)?.name) ?? ''}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(it)} disabled={!!actionLoading[it.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(it.id)} disabled={!!actionLoading[it.id]}>{actionLoading[it.id] ? '...' : 'Delete'}</Button>
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
