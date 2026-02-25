'use client'

import React, { useEffect, useState } from 'react'
import { studentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const router = useRouter()
  const [message, setMessage] = useState('')

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await studentAPI.list()
      if (res && res.length !== undefined) setStudents(res)
      else if (res && res.data) setStudents(res.data)
    } catch (err) {
      setError('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDeactivate = async (id: number) => {
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      await studentAPI.deactivate(id)
      setMessage('Student deactivated')
      await fetchStudents()
    } catch (err) {
      setError('Failed to deactivate')
    } finally {
      setActionLoading((s) => ({ ...s, [id]: false }))
    }
  }

  const handleActivate = async (id: number) => {
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      await studentAPI.activate(id)
      setMessage('Student activated')
      await fetchStudents()
    } catch (err) {
      setError('Failed to activate')
    } finally {
      setActionLoading((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Students</h1>
        <Link href='/apps/students/new'>
          <Button className='dashboard-add-btn'>Add Student</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Students</p>

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Name</th>
                <th className='listing-th'>Enrollment</th>
                <th className='listing-th'>Course</th>
                <th className='listing-th'>Mobile</th>
                <th className='listing-th'>Email</th>
                <th className='listing-th'>Status</th>
                <th className='listing-th'>Document</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={9} className='listing-empty'>No students found.</td>
                </tr>
              ) : (
                students.map((s, idx) => (
                  <tr key={s.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{((s.firstName || s.name) + ' ' + (s.lastName || '')).trim()}</td>
                    <td className='listing-td'>{s.enrollmentNumber || s.enrollNo || ''}</td>
                    <td className='listing-td'>{s.courseName || s.course || ''}</td>
                    <td className='listing-td'>{s.mobileNumber || s.mobile || ''}</td>
                    <td className='listing-td'>{s.email || ''}</td>
                    <td className='listing-td'>
                      <span className={s.isActive ? 'listing-badge-active' : 'listing-badge-inactive'}>
                        {s.status || (s.isActive ? 'Active' : 'Inactive')}
                      </span>
                    </td>
                    <td className='listing-td'>
                      {s.previousMarksheet || s.previousMarksheetUrl || s.profilePhoto || s.documentUrl ? (
                        <a className='text-blue-500 dark:text-blue-400 underline text-sm' href={s.previousMarksheet || s.previousMarksheetUrl || s.profilePhoto || s.documentUrl} target='_blank' rel='noreferrer'>View</a>
                      ) : '-'}
                    </td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => router.push(`/apps/students/new?id=${s.id}`)} disabled={!!actionLoading[s.id]}>Edit</Button>
                        {s.isActive ? (
                          <Button variant='destructive' size='sm' onClick={() => handleDeactivate(s.id)} disabled={!!actionLoading[s.id]}>{actionLoading[s.id] ? '...' : 'Deactivate'}</Button>
                        ) : (
                          <Button variant='success' size='sm' onClick={() => handleActivate(s.id)} disabled={!!actionLoading[s.id]}>{actionLoading[s.id] ? '...' : 'Activate'}</Button>
                        )}
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
