"use client"

import React, { useEffect, useState } from 'react'
import { courseAPI, programAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Course = {
  id: number
  name: string
  code?: string
  programId?: number
  program?: any
  fees?: number
  duration?: number
  durationType?: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await courseAPI.list()
      if (res && res.data) setCourses(res.data)
      else if (Array.isArray(res)) setCourses(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const p = await programAPI.list()
      if (p && p.data) setPrograms(p.data)
      else if (Array.isArray(p)) setPrograms(p)
    } catch (e) { }
  }

  useEffect(() => {
    fetchCourses()
    fetchPrograms()
  }, [])

  const openEdit = (c: Course) => {
    router.push(`/masters/courses/new?id=${c.id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this course?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await courseAPI.remove(id)
      if (res && (res.success || res.message === undefined)) {
        setMessage('Course deleted')
        await fetchCourses()
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
        <h1 className='listing-title'>Master – Courses</h1>
        <Link href='/masters/courses/new'>
          <Button className='dashboard-add-btn'>Add New Course</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Courses</p>

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
                <th className='listing-th'>Fees</th>
                <th className='listing-th'>Duration</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan={7} className='listing-empty'>No courses found.</td></tr>
              ) : (
                courses.map((c, idx) => (
                  <tr key={c.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{c.name}</td>
                    <td className='listing-td'>{c.code || ''}</td>
                    <td className='listing-td'>{c.program?.name ?? (programs.find(p => p.id === c.programId)?.name) ?? ''}</td>
                    <td className='listing-td'>{c.fees != null ? c.fees : ''}</td>
                    <td className='listing-td'>{c.duration ? `${c.duration} ${c.durationType ?? 'months'}` : ''}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(c)} disabled={!!actionLoading[c.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(c.id)} disabled={!!actionLoading[c.id]}>{actionLoading[c.id] ? '...' : 'Delete'}</Button>
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
