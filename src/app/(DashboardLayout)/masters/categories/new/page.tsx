"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categoryAPI } from '../../../../../lib/api'

export default function NewCategoryPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await categoryAPI.create({ name, code, description })
      if (res && res.data) {
        router.push('/masters/categories')
        return
      }
      if (res && res.id) {
        router.push('/masters/categories')
        return
      }
      setError(res?.message || 'Failed to create')
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
        <h1 className="text-2xl font-semibold mb-4">Add New Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-slate-800">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
          </div>
          <div>
            <label className="block mb-2 text-sm text-slate-800">Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="form-input" required />
          </div>
          <div>
            <label className="block mb-2 text-sm text-slate-800">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => router.push('/masters/categories')} className="px-4 py-2 border rounded text-slate-800">Cancel</button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  )
}
