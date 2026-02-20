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
    <div className='p-6 main-dashboard'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold text-white'>Students</h1>
        <div className='flex gap-2'>
          <Link href='/apps/students/new'>
            <Button className='dashboard-add-btn'>Add Student</Button>
          </Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Students</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className='overflow-auto'>
            <table className='w-full table-auto border dashboard-table'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 text-left'>Name</th>
                  <th className='p-2 text-left'>Email</th>
                  <th className='p-2 text-left'>Status</th>
                  <th className='p-2 text-left'>Document</th>
                  <th className='p-2 text-left'>Active</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className='border-t'>
                    <td className='p-2'>{s.name}</td>
                    <td className='p-2'>{s.email}</td>
                    <td className='p-2'>{s.status}</td>
                    <td className='p-2'>
                      {s.documentUrl ? (
                        <a className='text-blue-400 underline' href={s.documentUrl} target='_blank' rel='noreferrer'>View</a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className='p-2'>{String(s.isActive)}</td>
                    <td className='p-2 flex gap-2 dashboard-actions'>
                      <Button variant='outline' size='sm' onClick={() => router.push(`/apps/students/new?id=${s.id}`)} disabled={!!actionLoading[s.id]}>Edit</Button>
                      {s.isActive ? (
                        <Button variant='destructive' size='sm' onClick={() => handleDeactivate(s.id)} disabled={!!actionLoading[s.id]}>
                          {actionLoading[s.id] ? '...' : 'Deactivate'}
                        </Button>
                      ) : (
                        <Button variant='success' size='sm' onClick={() => handleActivate(s.id)} disabled={!!actionLoading[s.id]}>
                          {actionLoading[s.id] ? '...' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
