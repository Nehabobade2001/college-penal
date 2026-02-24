"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addressAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function NewAddressPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [stateVal, setStateVal] = useState('')
  const [pincode, setPincode] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchAddress = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/addresses/${idVal}`)
      const data = await res.json()
      if (data && data.data) {
        const a = data.data
        setName(a.name || '')
        setType(a.type || '')
        setAddressLine1(a.addressLine1 || '')
        setAddressLine2(a.addressLine2 || '')
        setCity(a.city || '')
        setStateVal(a.state || '')
        setPincode(a.pincode || '')
        setCountry(a.country || '')
        setDescription(a.description || '')
      }
    } catch (e) {}
  }

  useEffect(() => { if (id) fetchAddress(id) }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload: any = { name, type, addressLine1, addressLine2, city, state: stateVal, pincode, country, description }
      let res
      if (id) res = await addressAPI.update(Number(id), payload)
      else res = await addressAPI.create(payload)
      if (res && (res.data || res.id)) router.push('/masters/addresses')
      else setError(res?.message || 'Failed to save')
    } catch (err: any) { console.error(err); setError(err?.message || 'Failed to save') }
    finally { setLoading(false) }
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="form-card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-white">{id ? 'Edit Address' : 'Add New Address'}</h1>
        </div>

        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className='block mb-2 text-sm text-slate-300'>Name / Label</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Head Office' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Type</label>
            <input value={type} onChange={(e) => setType(e.target.value)} placeholder='Office / Branch / Home' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder='City' className='form-input' />
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Address Line 1</label>
            <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder='Address line 1' className='form-input' />
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Address Line 2</label>
            <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder='Address line 2' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>State</label>
            <input value={stateVal} onChange={(e) => setStateVal(e.target.value)} placeholder='State' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Pincode</label>
            <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder='Pincode' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Country</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder='Country' className='form-input' />
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Notes</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Optional notes' className='form-textarea' rows={3} />
          </div>

          <div className='md:col-span-2 flex gap-2 justify-end mt-2'>
            <Button variant='outline' onClick={() => router.push('/masters/addresses')}>Cancel</Button>
            <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
