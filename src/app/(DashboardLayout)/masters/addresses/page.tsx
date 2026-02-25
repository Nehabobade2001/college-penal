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
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Master – Addresses</h1>
        <Link href='/masters/addresses/new'>
          <Button className='dashboard-add-btn'>Add New Address</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Addresses</p>

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Name</th>
                <th className='listing-th'>Type</th>
                <th className='listing-th'>Address</th>
                <th className='listing-th'>City</th>
                <th className='listing-th'>State</th>
                <th className='listing-th'>Pincode</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={8} className='listing-empty'>No addresses found.</td></tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{it.name || ''}</td>
                    <td className='listing-td'>{it.type || ''}</td>
                    <td className='listing-td'>{it.addressLine1 ? `${it.addressLine1}${it.addressLine2 ? ', ' + it.addressLine2 : ''}` : ''}</td>
                    <td className='listing-td'>{it.city || ''}</td>
                    <td className='listing-td'>{it.state || ''}</td>
                    <td className='listing-td'>{it.pincode || ''}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(it)} disabled={!!actionLoading[it.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(it.id)} disabled={!!actionLoading[it.id]}>{actionLoading[it.id] ? '...' : 'Delete'}</Button>
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
