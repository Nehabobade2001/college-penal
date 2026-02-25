"use client"

import React, { useEffect, useState } from 'react'
import { centerAPI, feesAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

type Center = { id: number; name?: string }
type CollectionRow = { paymentMethod?: string; totalPayments?: number; totalCollection?: string | number }

export default function CenterCollectionPage() {
  const [centers, setCenters] = useState<Center[]>([])
  const [centerId, setCenterId] = useState<number | null>(null)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [data, setData] = useState<CollectionRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCenters = async () => {
    try {
      const res = await centerAPI.list()
      if (res && res.data) setCenters(res.data)
      else if (Array.isArray(res)) setCenters(res)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchCollection = async () => {
    if (!centerId) {
      setError('Select a center')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await feesAPI.centerCollection(centerId, fromDate || undefined, toDate || undefined)
      // backend returns array (raw rows) or { data: [] }
      const rows = res && res.data ? res.data : Array.isArray(res) ? res : []
      setData(rows)
    } catch (e) {
      console.error(e)
      setError('Failed to load collection')
    } finally {
      setLoading(false)
    }
  }

  const exportExcel = async () => {
    if (!centerId) { setError('Select a center'); return }
    try {
      const blob = await feesAPI.exportCenterExcel(centerId, fromDate || undefined, toDate || undefined)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `center-${centerId}-collection.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      setError('Export failed')
    }
  }

  useEffect(() => { fetchCenters() }, [])

  return (
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Center-wise Collection</h1>
        <div className='flex gap-2'>
          <select value={centerId ?? ''} onChange={(e) => setCenterId(e.target.value ? Number(e.target.value) : null)} className='input'>
            <option value=''>Select center</option>
            {centers.map(c => <option key={c.id} value={c.id}>{c.name || `Center ${c.id}`}</option>)}
          </select>
          <input type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} className='input' />
          <input type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} className='input' />
          <Button onClick={fetchCollection}>Load</Button>
          <Button onClick={exportExcel}>Export Excel</Button>
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
                <th className='listing-th'>Payment Method</th>
                <th className='listing-th'>Total Payments</th>
                <th className='listing-th'>Total Collection</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className='listing-empty'>No collection data found.</td></tr>
              ) : (
                data.map((r, idx) => (
                  <tr key={idx} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{r.paymentMethod || '-'}</td>
                    <td className='listing-td'>{r.totalPayments ?? 0}</td>
                    <td className='listing-td'>{r.totalCollection ?? '-'}</td>
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
