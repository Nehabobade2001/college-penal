"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { departmentAPI, categoryAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function NewDepartmentPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchDepartment = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/departments/${idVal}`)
      const data = await res.json()
      if (data) {
        setName(data.name || '')
        setCode(data.code || '')
        setDescription(data.description || '')
        setCategoryId((data.categoryId ?? data.category?.id ?? data.category ?? '') + '')
      }
    } catch (e) {
      // ignore
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.list()
      if (res && res.data) setCategories(res.data)
      else if (Array.isArray(res)) setCategories(res)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { if (id) fetchDepartment(id) }, [id])
  useEffect(() => { fetchCategories() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!categoryId) {
        setError('Category is required')
        setLoading(false)
        return
      }
      const payload: any = { name, code, description, categoryId }
      let res
      if (id) res = await departmentAPI.update(Number(id), payload)
      else res = await departmentAPI.create(payload)
      if (res && (res.data || res.id)) router.push('/masters/departments')
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
          <h1 className="text-2xl font-semibold text-white">{id ? 'Edit Department' : 'Add New Department'}</h1>
        </div>

        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className='block mb-2 text-sm text-slate-300'>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder='Short code (optional)' className='w-full p-3 rounded bg-slate-800 text-white border border-slate-700 placeholder-slate-400' />
          </div>

          <div>
            <label className='block mb-2 text-sm text-slate-300'>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-select"
            >
              <option value=''>-- Select category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm text-slate-300'>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className='md:col-span-2 flex gap-2 justify-end mt-2'>
            <Button variant='outline' onClick={() => router.push('/masters/departments')}>Cancel</Button>
            <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
