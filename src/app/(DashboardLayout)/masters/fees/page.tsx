"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { feesAPI } from '@/lib/api'

type Payment = {
  id: number
  receiptNumber?: string
  student?: { firstName?: string; lastName?: string }
  amount?: number
  paymentDate?: string
  paymentMethod?: string
  centerId?: number
}

export default function FeesPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPayments = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await feesAPI.allPayments()
      if (res && res.data) setPayments(res.data)
      else if (Array.isArray(res)) setPayments(res)
      else setPayments([])
    } catch (e) {
      console.error(e)
      setError('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPayments() }, [])

  return (
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Fees & Accounts</h1>
      </div>

      <div className='card p-4 mb-4'>
      
        <div className='flex gap-2'>
          <Button onClick={fetchPayments}>View All Payments</Button>
          <Button onClick={() => alert('Open Center-wise Collection (not yet implemented)')}>Center-wise Collection</Button>
          <Button onClick={() => alert('Open Pending Fees Report (not yet implemented)')}>Pending Fees Report</Button>
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
                <th className='listing-th'>Receipt</th>
                <th className='listing-th'>Student</th>
                <th className='listing-th'>Amount</th>
                <th className='listing-th'>Date</th>
                <th className='listing-th'>Method</th>
                <th className='listing-th'>Center</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7} className='listing-empty'>No payments found.</td></tr>
              ) : (
                payments.map((p, idx) => (
                  <tr key={p.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{p.receiptNumber || '-'}</td>
                    <td className='listing-td'>{p.student ? `${p.student.firstName || ''} ${p.student.lastName || ''}`.trim() : '-'}</td>
                    <td className='listing-td'>{p.amount != null ? p.amount : '-'}</td>
                    <td className='listing-td'>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</td>
                    <td className='listing-td'>{p.paymentMethod || '-'}</td>
                    <td className='listing-td'>{p.centerId ?? '-'}</td>
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
