"use client"

import React, { useEffect, useState } from 'react'
import { subjectAPI, departmentAPI, programAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Subject = {
  id: number
  name: string
  code?: string
  description?: string
  departmentId?: number
  programId?: number
  department?: any
  program?: any
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchSubjects = async () => {
    setLoading(true)
    try {
      const res = await subjectAPI.list()
      if (res && res.data) setSubjects(res.data)
      else if (Array.isArray(res)) setSubjects(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  const fetchDepsAndPrograms = async () => {
    try {
      const d = await departmentAPI.list()
      if (d && d.data) setDepartments(d.data)
      else if (Array.isArray(d)) setDepartments(d)
    } catch (e) { }

    try {
      const p = await programAPI.list()
      if (p && p.data) setPrograms(p.data)
      else if (Array.isArray(p)) setPrograms(p)
    } catch (e) { }
  }

  useEffect(() => {
    fetchSubjects()
    fetchDepsAndPrograms()
  }, [])

  const openEdit = (s: Subject) => {
    router.push(`/masters/subjects/new?id=${s.id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this subject?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await subjectAPI.remove(id)
      if (res && (res.success || res.message === undefined)) {
        setMessage('Subject deleted')
        await fetchSubjects()
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
        <h1 className='listing-title'>Master – Subjects</h1>
        <Link href='/masters/subjects/new'>
          <Button className='dashboard-add-btn'>Add New Subject</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Subjects</p>

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
                <th className='listing-th'>Department</th>
                <th className='listing-th'>Program</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan={6} className='listing-empty'>No subjects found.</td></tr>
              ) : (
                subjects.map((s, idx) => (
                  <tr key={s.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{s.name}</td>
                    <td className='listing-td'>{s.code || ''}</td>
                    <td className='listing-td'>{s.department?.name ?? (departments.find(d => d.id === s.departmentId)?.name) ?? ''}</td>
                    <td className='listing-td'>{s.program?.name ?? (programs.find(p => p.id === s.programId)?.name) ?? ''}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(s)} disabled={!!actionLoading[s.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(s.id)} disabled={!!actionLoading[s.id]}>{actionLoading[s.id] ? '...' : 'Delete'}</Button>
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
