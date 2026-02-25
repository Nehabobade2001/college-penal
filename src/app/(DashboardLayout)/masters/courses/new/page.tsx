"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { courseAPI, programAPI, subjectAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function NewCoursePage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [programId, setProgramId] = useState<string>('')
  const [subjectIds, setSubjectIds] = useState<string[]>([])
  const [fees, setFees] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [durationType, setDurationType] = useState<string>('months')
  const [eligibility, setEligibility] = useState('')
  const [totalSeats, setTotalSeats] = useState<string>('')
  const [availableSeats, setAvailableSeats] = useState<string>('')

  const [programs, setPrograms] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchCourse = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/courses/${idVal}`)
      const data = await res.json()
      if (data && data.data) {
        const c = data.data
        setName(c.name || '')
        setCode(c.code || '')
        setDescription(c.description || '')
        setProgramId((c.programId ?? c.program?.id ?? '') + '')
        setSubjectIds((c.subjects || []).map((s: any) => String(s.id)))
        setFees(c.fees != null ? String(c.fees) : '')
        setDuration(c.duration != null ? String(c.duration) : '')
        setDurationType(c.durationType || 'months')
        setEligibility(c.eligibility || '')
        setTotalSeats(c.totalSeats != null ? String(c.totalSeats) : '')
        setAvailableSeats(c.availableSeats != null ? String(c.availableSeats) : '')
      }
    } catch (e) {
      // ignore
    }
  }

  const fetchDeps = async () => {
    try {
      const p = await programAPI.list()
      if (p && p.data) setPrograms(p.data)
      else if (Array.isArray(p)) setPrograms(p)
    } catch (e) { }

    try {
      const s = await subjectAPI.list()
      if (s && s.data) setSubjects(s.data)
      else if (Array.isArray(s)) setSubjects(s)
    } catch (e) { }
  }

  useEffect(() => { if (id) fetchCourse(id) }, [id])
  useEffect(() => { fetchDeps() }, [])

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
    setSubjectIds(selected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!name) { setError('Name is required'); setLoading(false); return }
      if (!programId) { setError('Program is required'); setLoading(false); return }
      const payload: any = {
        name,
        code,
        description,
        programId: Number(programId),
        subjects: subjectIds.map((s) => Number(s)),
        fees: fees ? Number(fees) : undefined,
        duration: duration ? Number(duration) : undefined,
        durationType,
        eligibility,
        totalSeats: totalSeats ? Number(totalSeats) : undefined,
        availableSeats: availableSeats ? Number(availableSeats) : undefined,
      }

      let res
      if (id) res = await courseAPI.update(Number(id), payload)
      else res = await courseAPI.create(payload)

      if (res && (res.data || res.id)) router.push('/masters/courses')
      else setError(res?.message || 'Failed to save')
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to save')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 w-full">
      <div className="form-card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{id ? 'Edit Course' : 'Add New Course'}</h1>
        </div>

        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="md:col-span-2">
            <label className='block mb-2 text-sm form-label'>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Course name' className='form-input' required />
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
            <label className='block mb-2 text-sm form-label'>Subjects (hold Ctrl/Cmd to multi-select)</label>
            <select multiple value={subjectIds} onChange={handleSubjectChange} className='form-select h-40'>
              {subjects.map((s) => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Fees</label>
            <input value={fees} onChange={(e) => setFees(e.target.value)} placeholder='0.00' className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Duration</label>
            <div className='flex flex-col gap-2'>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder='Number' className='form-input' />
              <select value={durationType} onChange={(e) => setDurationType(e.target.value)} className='form-select'>
                <option value='months'>Months</option>
                <option value='years'>Years</option>
                <option value='weeks'>Weeks</option>
              </select>
            </div>
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm form-label'>Eligibility</label>
            <textarea value={eligibility} onChange={(e) => setEligibility(e.target.value)} placeholder='Eligibility criteria' className='form-textarea' rows={3} />
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Total Seats</label>
            <input value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} className='form-input' />
          </div>

          <div>
            <label className='block mb-2 text-sm form-label'>Available Seats</label>
            <input value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} className='form-input' />
          </div>

          <div className='md:col-span-2 flex gap-2 justify-end mt-2'>
            <Button variant='outline' onClick={() => router.push('/masters/courses')}>Cancel</Button>
            <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
