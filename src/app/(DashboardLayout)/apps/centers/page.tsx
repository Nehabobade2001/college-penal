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
    <div className='p-6 main-dashboard'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold text-white'>Centers</h1>
        <div className='flex gap-2'>
          <Link href='/apps/centers/new'>
            <Button className='dashboard-add-btn'>Add Center</Button>
          </Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Centers</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className='overflow-auto'>
            <table className='w-full table-auto border dashboard-table'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 text-left'>Name</th>
                  <th className='p-2 text-left'>Address</th>
                  <th className='p-2 text-left'>Phone</th>
                  <th className='p-2 text-left'>Email</th>
                  <th className='p-2 text-left'>Active</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centers.map((c) => (
                  <tr key={c.id} className='border-t'>
                    <td className='p-2'>{c.name}</td>
                    <td className='p-2'>{c.address}</td>
                    <td className='p-2'>{c.phone}</td>
                    <td className='p-2'>{c.email}</td>
                    <td className='p-2'>{String(c.isActive)}</td>
                    <td className='p-2 flex gap-2 dashboard-actions'>
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
