"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { specializationAPI, programAPI, departmentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function NewSpecializationPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [programId, setProgramId] = useState<string>('')
  const [departmentId, setDepartmentId] = useState<string>('')
  const [programs, setPrograms] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchItem = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/specializations/${idVal}`)
      const data = await res.json()
      if (data && data.data) {
        const s = data.data
        setName(s.name || '')
        setCode(s.code || '')
        setDescription(s.description || '')
        setProgramId((s.programId ?? s.program?.id ?? '') + '')
        setDepartmentId((s.departmentId ?? s.department?.id ?? '') + '')
      }
    } catch (e) { }
  }

  const fetchDepsAndPrograms = async () => {
    try {
      const p = await programAPI.list()
      if (p && p.data) setPrograms(p.data)
      else if (Array.isArray(p)) setPrograms(p)
    } catch (e) { }

    try {
      const d = await departmentAPI.list()
      if (d && d.data) setDepartments(d.data)
      else if (Array.isArray(d)) setDepartments(d)
    } catch (e) { }
  }

  useEffect(() => { if (id) fetchItem(id) }, [id])
  useEffect(() => { fetchDepsAndPrograms() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!programId) { setError('Program is required'); setLoading(false); return }
      const payload: any = { name, code, description, programId: Number(programId), departmentId: departmentId ? Number(departmentId) : undefined }
      let res
      if (id) res = await specializationAPI.update(Number(id), payload)
      else res = await specializationAPI.create(payload)
      if (res && (res.data || res.id)) router.push('/masters/specializations')
      else setError(res?.message || 'Failed to save')
    } catch (err: any) { console.error(err); setError(err?.message || 'Failed to save') }
    finally { setLoading(false) }
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="form-card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{id ? 'Edit Specialization' : 'Add New Specialization'}</h1>
        </div>

        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className='block mb-2 text-sm form-label'>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Specialization name' className='form-input' required />
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder='Short code' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Program</label>
            <select value={programId} onChange={(e) => setProgramId(e.target.value)} className='form-select' required>
              <option value=''>-- Select program --</option>
              {programs.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Department (optional)</label>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className='form-select'>
              <option value=''>-- Select department --</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm form-label'>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Short description' className='form-textarea' rows={4} />
          </div>

          <div className='md:col-span-2 flex gap-2 justify-end mt-2'>
            <Button variant='outline' onClick={() => router.push('/masters/specializations')}>Cancel</Button>
            <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
