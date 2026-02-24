"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { programAPI, departmentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function NewProgramPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState<number | ''>('')
  const [durationType, setDurationType] = useState('')
  const [departmentId, setDepartmentId] = useState<string>('')
  const [departments, setDepartments] = useState<any[]>([])
  const [status, setStatus] = useState('active')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchProgram = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/programs/${idVal}`)
      const data = await res.json()
      if (data && data.data) {
        const p = data.data
        setName(p.name || '')
        setCode(p.code || '')
        setDescription(p.description || '')
        setDuration(p.duration ?? '')
        setDurationType(p.durationType || '')
        setDepartmentId((p.departmentId ?? p.department?.id ?? '') + '')
        setStatus(p.status || 'active')
      }
    } catch (e) {
      // ignore
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.list()
      if (res && res.data) setDepartments(res.data)
      else if (Array.isArray(res)) setDepartments(res)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { if (id) fetchProgram(id) }, [id])
  useEffect(() => { fetchDepartments() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!departmentId) {
        setError('Department is required')
        setLoading(false)
        return
      }
      const payload: any = { name, code, description, duration: duration === '' ? undefined : Number(duration), durationType, departmentId: Number(departmentId), status }
      let res
      if (id) res = await programAPI.update(Number(id), payload)
      else res = await programAPI.create(payload)
      if (res && (res.data || res.id)) router.push('/masters/programs')
      else setError(res?.message || 'Failed to save')
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to save')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="form-card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-white">{id ? 'Edit Program' : 'Add New Program'}</h1>
        </div>

        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className='block mb-2 text-sm text-slate-300'>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Program name' className='form-input' required />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder='Short code' className='form-input' required />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Duration</label>
            <input type='number' value={duration} onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))} placeholder='e.g. 3' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Duration Type</label>
            <input value={durationType} onChange={(e) => setDurationType(e.target.value)} placeholder='Years / Months' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Department</label>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className='form-select' required>
              <option value=''>-- Select department --</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Short description' className='form-textarea' rows={4} />
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className='form-select'>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>

          <div className='md:col-span-2 flex gap-2 justify-end mt-2'>
            <Button variant='outline' onClick={() => router.push('/masters/programs')}>Cancel</Button>
            <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
