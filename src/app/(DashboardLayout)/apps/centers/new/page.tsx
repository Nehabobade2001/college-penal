'use client'

import React, { useEffect, useState } from 'react'
import { centerAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NewCenterPage() {
  const [form, setForm] = useState({
    name: '',
    // Franchise Basic Info
    franchiseName: '',
    ownerName: '',
    email: '',
    contactNumber: '',
    alternateNumber: '',
    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Legal
    registrationNumber: '',
    gstNumber: '',
    agreementStartDate: '',
    agreementEndDate: '',
    notes: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useSearchParams()
  const editingId = params?.get('id') ? Number(params.get('id')) : null

  useEffect(() => {
    // If editing, fetch center and populate form
    const fetchForEdit = async () => {
      if (!editingId) return
      try {
        const res = await centerAPI.list()
        const existing = res && res.find ? res.find((c: any) => c.id === editingId) : null
        if (existing) setForm({
          name: existing.name || '',
          franchiseName: existing.franchiseName || existing.name || '',
          ownerName: existing.ownerName || '',
          email: existing.email || '',
          contactNumber: existing.contactNumber || existing.phone || '',
          alternateNumber: existing.alternateNumber || '',
          address: existing.address || '',
          city: existing.city || '',
          state: existing.state || '',
          pincode: existing.pincode || '',
          registrationNumber: existing.registrationNumber || '',
          gstNumber: existing.gstNumber || '',
          agreementStartDate: existing.agreementStartDate ? existing.agreementStartDate.split('T')[0] : '',
          agreementEndDate: existing.agreementEndDate ? existing.agreementEndDate.split('T')[0] : '',
          notes: existing.notes || ''
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchForEdit()
  }, [editingId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // client-side password match validation when creating
      if (!editingId && form.password) {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
      }

      if (editingId) {
        await centerAPI.update(editingId, form)
      } else {
        await centerAPI.create(form)
      }
      router.push('/apps/centers')
    } catch (err) {
      setError('Failed to save center')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6 main-dashboard'>
      <h1 className='text-2xl font-semibold mb-4 text-dark dark:text-white'>{editingId ? 'Edit Center' : 'Add New Center'}</h1>
      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}

      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='md:col-span-3'>
          <h2 className='text-lg font-semibold text-dark dark:text-white mb-1'>Franchise — Basic Info</h2>
          <p className='text-sm text-gray-500 mb-3'>Primary contact and identification details for the franchise.</p>
        </div>

        <Input placeholder='Franchise Name' value={form.franchiseName} onChange={(e: any) => setForm({ ...form, franchiseName: e.target.value })} required />
        <Input placeholder='Owner Name' value={form.ownerName} onChange={(e: any) => setForm({ ...form, ownerName: e.target.value })} />
        <Input placeholder='Email' value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder='Contact Number' value={form.contactNumber} onChange={(e: any) => setForm({ ...form, contactNumber: e.target.value })} />
        <Input placeholder='Alternate Number' value={form.alternateNumber} onChange={(e: any) => setForm({ ...form, alternateNumber: e.target.value })} />

        <div className='md:col-span-3'>
          <h2 className='text-lg font-semibold text-dark dark:text-white mb-1'>Location</h2>
          <p className='text-sm text-gray-500 mb-3'>Address and geographic details.</p>
        </div>

        <Input placeholder='Address' value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} />
        <Input placeholder='City' value={form.city} onChange={(e: any) => setForm({ ...form, city: e.target.value })} />
        <Input placeholder='State' value={form.state} onChange={(e: any) => setForm({ ...form, state: e.target.value })} />
        <Input placeholder='Pincode' value={form.pincode} onChange={(e: any) => setForm({ ...form, pincode: e.target.value })} />

        <div className='md:col-span-3'>
          <h2 className='text-lg font-semibold text-dark dark:text-white mb-1'>Legal Info</h2>
          <p className='text-sm text-gray-500 mb-3'>Registration and agreement dates.</p>
        </div>

        <Input placeholder='Registration Number' value={form.registrationNumber} onChange={(e: any) => setForm({ ...form, registrationNumber: e.target.value })} />
        <Input placeholder='GST Number' value={form.gstNumber} onChange={(e: any) => setForm({ ...form, gstNumber: e.target.value })} />
        <Input type='date' placeholder='Agreement Start Date' value={form.agreementStartDate} onChange={(e: any) => setForm({ ...form, agreementStartDate: e.target.value })} />
        <Input type='date' placeholder='Agreement End Date' value={form.agreementEndDate} onChange={(e: any) => setForm({ ...form, agreementEndDate: e.target.value })} />

        <Input placeholder='Notes' value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} />

        {!editingId && (
          <>
            <Input type='password' placeholder='Password' value={form.password} onChange={(e: any) => setForm({ ...form, password: e.target.value })} />
            <Input type='password' placeholder='Confirm Password' value={form.confirmPassword} onChange={(e: any) => setForm({ ...form, confirmPassword: e.target.value })} />
          </>
        )}

        <div className='md:col-span-3 flex gap-2'>
          <Button type='submit' disabled={loading}>{loading ? 'Saving...' : editingId ? 'Update Center' : 'Create Center'}</Button>
          <Button variant='outline' type='button' onClick={() => router.push('/apps/centers')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
