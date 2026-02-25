"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { categoryAPI } from '../../../../../lib/api'

export default function NewCategoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idParam = searchParams?.get('id')
  const isEdit = !!idParam
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    const fetchCategory = async () => {
      setLoading(true)
      try {
        const id = Number(idParam)
        if (!id) throw new Error('Invalid id')
        const res: any = await categoryAPI.get(id)
        if (res) {
          // API may return object at res.data or directly
          const payload = res.data || res
          setName(payload.name || '')
          setCode(payload.code || '')
          setDescription(payload.description || '')
        }
      } catch (err: any) {
        console.error('Failed to fetch category', err)
        setError(err?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [idParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res: any
      if (isEdit) {
        const id = Number(idParam)
        res = await categoryAPI.update(id, { name, code, description })
      } else {
        res = await categoryAPI.create({ name, code, description })
      }
      if (res && (res.data || res.id || res.success)) {
        router.push('/masters/categories')
        return
      }
      setError(res?.message || 'Failed to save')
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="form-card">
        <h1 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Category' : 'Add New Category'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm form-label">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. General, Science, Arts' className="form-input" required />
          </div>
          <div>
            <label className="block mb-2 text-sm form-label">Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder='e.g. GEN, SCI' className="form-input" required />
          </div>
          <div>
            <label className="block mb-2 text-sm form-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Short description (optional)' className="form-textarea" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => router.push('/masters/categories')} className="px-4 py-2 border rounded text-dark dark:text-white dark:border-slate-600">Cancel</button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  )
}
