"use client"

import React, { useEffect, useState } from 'react'
import { complaintAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Complaint = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  studentId: number
  createdAt: string
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const router = useRouter()

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const res = await complaintAPI.list()
      if (res && res.data) setComplaints(res.data)
      else if (Array.isArray(res)) setComplaints(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this complaint?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await complaintAPI.remove(id)
      if (res && (res.success || res.message === undefined)) {
        setMessage('Complaint deleted')
        await fetchComplaints()
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

  const handleClose = async (id: number) => {
    if (!confirm('Close this complaint?')) return
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await complaintAPI.close(id)
      if (res && res.id) {
        setMessage('Complaint closed')
        await fetchComplaints()
      }
    } catch (err) {
      console.error(err)
      setError('Failed to close')
    } finally {
      setActionLoading((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Complaints</h1>
        <Link href='/masters/complaints/new'>
          <Button className='dashboard-add-btn'>Add Complaint</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Complaints</p>

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Title</th>
                <th className='listing-th'>Student</th>
                <th className='listing-th'>Priority</th>
                <th className='listing-th'>Status</th>
                <th className='listing-th'>Created</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr><td colSpan={7} className='listing-empty'>No complaints found.</td></tr>
              ) : (
                complaints.map((c, idx) => (
                  <tr key={c.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{c.title}</td>
                    <td className='listing-td'>{c.studentId}</td>
                    <td className='listing-td'>{c.priority}</td>
                    <td className='listing-td'>{c.status}</td>
                    <td className='listing-td'>{new Date(c.createdAt).toLocaleString()}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => router.push(`/masters/complaints/new?id=${c.id}`)}>Edit</Button>
                        <Button variant='secondary' size='sm' onClick={() => router.push(`/masters/complaints/${c.id}`)}>View</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(c.id)} disabled={!!actionLoading[c.id]}>{actionLoading[c.id] ? '...' : 'Delete'}</Button>
                        <Button size='sm' onClick={() => handleClose(c.id)} disabled={!!actionLoading[c.id]}>Close</Button>
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
