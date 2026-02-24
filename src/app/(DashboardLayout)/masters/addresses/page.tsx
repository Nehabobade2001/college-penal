"use client"

import React, { useEffect, useState } from 'react'
import { addressAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Address = {
  id: number
  name?: string
  type?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await addressAPI.list()
      if (res && res.data) setItems(res.data)
      else if (Array.isArray(res)) setItems(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load addresses')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const openEdit = (it: Address) => router.push(`/masters/addresses/new?id=${it.id}`)

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await addressAPI.remove(id)
      if (res && (res.success || res.message === undefined)) { setMessage('Deleted'); await fetchItems() }
      else if (res && res.message) setError(res.message)
    } catch (err) { console.error(err); setError('Failed to delete') }
    finally { setActionLoading((s) => ({ ...s, [id]: false })) }
  }

  return (
    <div className="p-6 main-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Master - Addresses</h1>
        <div className="flex gap-2">
          <Link href="/masters/addresses/new"><Button className="dashboard-add-btn">Add New Address</Button></Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Addresses</h2>
        {loading ? <div>Loading...</div> : (
          <div className='overflow-auto'>
            <table className='w-full table-auto border dashboard-table'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 text-left'>S.No</th>
                  <th className='p-2 text-left'>Name</th>
                  <th className='p-2 text-left'>Type</th>
                  <th className='p-2 text-left'>Address</th>
                  <th className='p-2 text-left'>City</th>
                  <th className='p-2 text-left'>State</th>
                  <th className='p-2 text-left'>Pincode</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={8} className='p-4'>No addresses found.</td></tr>
                ) : (
                  items.map((it, idx) => (
                    <tr key={it.id} className='border-t'>
                      <td className='p-2'>{idx + 1}</td>
                      <td className='p-2'>{it.name || ''}</td>
                      <td className='p-2'>{it.type || ''}</td>
                      <td className='p-2'>{it.addressLine1 ? `${it.addressLine1}${it.addressLine2 ? ', ' + it.addressLine2 : ''}` : ''}</td>
                      <td className='p-2'>{it.city || ''}</td>
                      <td className='p-2'>{it.state || ''}</td>
                      <td className='p-2'>{it.pincode || ''}</td>
                      <td className='p-2 flex gap-2 dashboard-actions'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(it)} disabled={!!actionLoading[it.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(it.id)} disabled={!!actionLoading[it.id]}>{actionLoading[it.id] ? '...' : 'Delete'}</Button>
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
