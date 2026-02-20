'use client'

import React, { useEffect, useState } from 'react'
import { studentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export default function StudentFormPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [qualification, setQualification] = useState('')
  const [percentage, setPercentage] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const fetchStudent = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/students/${idVal}`)
      const data = await res.json()
      if (data) {
        setName(data.name || '')
        setEmail(data.email || '')
        setQualification(data.qualification || '')
        setPercentage(data.percentage ? String(data.percentage) : '')
        setFileUrl(data.documentUrl || '')
        setStatus(data.status || 'active')
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    if (id) fetchStudent(id)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const payload: any = { name, email, status, qualification }
      if (percentage) payload.percentage = Number(percentage)
      if (fileUrl) payload.documentUrl = fileUrl
      if (password) payload.password = password
      let res
      if (id) {
        res = await studentAPI.update(Number(id), payload)
      } else {
        res = await studentAPI.create(payload)
      }
      setMessage('Saved successfully')
      router.push('/apps/students')
    } catch (err) {
      setError('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6 main-dashboard'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold text-white'>{id ? 'Edit Student' : 'Add Student'}</h1>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <form onSubmit={handleSubmit} className='max-w-4xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block mb-2 text-sm text-slate-300'>Name</label>
            <input
              className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700 placeholder-slate-400'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Email</label>
            <input
              className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700 placeholder-slate-400'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Qualification</label>
            <input
              className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700 placeholder-slate-400'
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Percentage</label>
            <input
              className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700 placeholder-slate-400'
              type='number'
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Upload Document</label>
            <div className='flex items-center gap-4'>
              <input
                className='p-2 text-sm text-slate-300'
                type='file'
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const form = new FormData()
                  form.append('file', file)
                  try {
                    const uplRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/files/upload`, {
                      method: 'POST',
                      body: form,
                    })
                    const data = await uplRes.json()
                    // API returns { files: [url], ... }
                    if (data && data.files && data.files.length > 0) {
                      setFileUrl(data.files[0])
                    }
                  } catch (err) {
                    console.error('Upload failed', err)
                  }
                }}
              />
              {fileUrl && (
                <a className='text-blue-400 underline text-sm' href={fileUrl} target='_blank' rel='noreferrer'>
                  View uploaded file
                </a>
              )}
            </div>
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Password (optional)</label>
            <input
              className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700 placeholder-slate-400'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Status</label>
            <select
              className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='active'>active</option>
              <option value='inactive'>inactive</option>
            </select>
          </div>
        </div>

        <div className='flex gap-2 mt-6'>
          <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          <Button variant='outline' onClick={() => router.push('/apps/students')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
