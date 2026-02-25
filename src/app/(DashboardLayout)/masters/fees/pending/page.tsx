"use client"

import React, { useEffect, useState } from 'react'
import { feesAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

type PendingFee = {
  id: number
  student?: { firstName?: string; lastName?: string }
  feeStructure?: { course?: { name?: string } }
  totalAmount?: number
  paidAmount?: number
  pendingAmount?: number
  dueDate?: string
  status?: string
}

export default function PendingFeesPage() {
  const [items, setItems] = useState<PendingFee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPending = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await feesAPI.pendingReport()
      if (res && res.data) setItems(res.data)
      else if (Array.isArray(res)) setItems(res)
      else setItems([])
    } catch (e) {
      console.error(e)
      setError('Failed to load pending fees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPending() }, [])

  return (
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Pending Fees Report</h1>
        <div>
          <Button onClick={fetchPending}>Refresh</Button>
        </div>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Student</th>
                <th className='listing-th'>Course</th>
                <th className='listing-th'>Total</th>
                <th className='listing-th'>Paid</th>
                <th className='listing-th'>Pending</th>
                <th className='listing-th'>Due Date</th>
                <th className='listing-th'>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={8} className='listing-empty'>No pending fees found.</td></tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{it.student ? `${it.student.firstName || ''} ${it.student.lastName || ''}`.trim() : '-'}</td>
                    <td className='listing-td'>{it.feeStructure?.course?.name || '-'}</td>
                    <td className='listing-td'>{it.totalAmount ?? '-'}</td>
                    <td className='listing-td'>{it.paidAmount ?? 0}</td>
                    <td className='listing-td'>{it.pendingAmount ?? '-'}</td>
                    <td className='listing-td'>{it.dueDate ? new Date(it.dueDate).toLocaleDateString() : '-'}</td>
                    <td className='listing-td'>{it.status || '-'}</td>
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
