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
    } catch (e) {}

    try {
      const p = await programAPI.list()
      if (p && p.data) setPrograms(p.data)
      else if (Array.isArray(p)) setPrograms(p)
    } catch (e) {}
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
    <div className="p-6 main-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Master - Subjects</h1>
        <div className="flex gap-2">
          <Link href="/masters/subjects/new">
            <Button className="dashboard-add-btn">Add New Subject</Button>
          </Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Subjects</h2>
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
                  <th className='p-2 text-left'>Department</th>
                  <th className='p-2 text-left'>Program</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length === 0 ? (
                  <tr><td colSpan={6} className='p-4'>No subjects found.</td></tr>
                ) : (
                  subjects.map((s, idx) => (
                    <tr key={s.id} className='border-t'>
                      <td className='p-2'>{idx + 1}</td>
                      <td className='p-2'>{s.name}</td>
                      <td className='p-2'>{s.code || ''}</td>
                      <td className='p-2'>{s.department?.name ?? (departments.find(d => d.id === s.departmentId)?.name) ?? ''}</td>
                      <td className='p-2'>{s.program?.name ?? (programs.find(p => p.id === s.programId)?.name) ?? ''}</td>
                      <td className='p-2 flex gap-2 dashboard-actions'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(s)} disabled={!!actionLoading[s.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(s.id)} disabled={!!actionLoading[s.id]}>
                          {actionLoading[s.id] ? '...' : 'Delete'}
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
