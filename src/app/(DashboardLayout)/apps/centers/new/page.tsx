'use client'

import React, { useEffect, useState } from 'react'
import { centerAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NewCenterPage() {
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', notes: '', password: '', confirmPassword: '' })
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
        if (existing) setForm({ name: existing.name || '', address: existing.address || '', phone: existing.phone || '', email: existing.email || '', notes: existing.notes || '' })
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
      <h1 className='text-2xl font-semibold mb-4 text-white'>{editingId ? 'Edit Center' : 'Add New Center'}</h1>
      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}

      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <Input placeholder='Name' value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
        <Input placeholder='Address' value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} />
        <Input placeholder='Phone' value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder='Email' value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
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
