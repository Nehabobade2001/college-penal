'use client'

import React, { useEffect, useState } from 'react'
import { centerAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CentersPage() {
  const [centers, setCenters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const router = useRouter()
  const [message, setMessage] = useState('')

  const fetchCenters = async () => {
    setLoading(true)
    try {
      const res = await centerAPI.list()
      if (res && res.length !== undefined) setCenters(res)
      else if (res && res.data) setCenters(res.data)
    } catch (err) {
      setError('Failed to fetch centers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCenters()
  }, [])

  const handleDeactivate = async (id: number) => {
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      await centerAPI.deactivate(id)
      setMessage('Center deactivated')
      await fetchCenters()
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
      await centerAPI.activate(id)
      setMessage('Center activated')
      await fetchCenters()
    } catch (err) {
      setError('Failed to activate')
    } finally {
      setActionLoading((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Centers</h1>
        <Link href='/apps/centers/new'>
          <Button className='dashboard-add-btn'>Add Center</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Centers</p>

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Franchise Name</th>
                <th className='listing-th'>Address</th>
                <th className='listing-th'>Contact Number</th>
                <th className='listing-th'>Email</th>
                <th className='listing-th'>Active</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {centers.length === 0 ? (
                <tr>
                  <td colSpan={7} className='listing-empty'>No centers found.</td>
                </tr>
              ) : (
                centers.map((c, idx) => (
                  <tr key={c.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{(c as any).franchiseName || c.name}</td>
                    <td className='listing-td'>{c.address || ''}</td>
                    <td className='listing-td'>{(c as any).contactNumber || c.phone || ''}</td>
                    <td className='listing-td'>{c.email}</td>
                    <td className='listing-td'>
                      <span className={c.isActive ? 'listing-badge-active' : 'listing-badge-inactive'}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='listing-td-actions'>
                      <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' onClick={() => router.push(`/apps/centers/new?id=${c.id}`)} disabled={!!actionLoading[c.id]}>Edit</Button>
                        {c.isActive ? (
                          <Button variant='destructive' size='sm' onClick={() => handleDeactivate(c.id)} disabled={!!actionLoading[c.id]}>
                            {actionLoading[c.id] ? '...' : 'Deactivate'}
                          </Button>
                        ) : (
                          <Button variant='success' size='sm' onClick={() => handleActivate(c.id)} disabled={!!actionLoading[c.id]}>
                            {actionLoading[c.id] ? '...' : 'Activate'}
                          </Button>
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
