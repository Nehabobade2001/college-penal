"use client"

import React, { useEffect, useState } from 'react'
import { categoryAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Category = {
  id: number
  name: string
  code: string
  description?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await categoryAPI.list()
      if (res && res.data) setCategories(res.data)
      else if (Array.isArray(res)) setCategories(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])


  const openEdit = (cat: Category) => {
    router.push(`/masters/categories/new?id=${cat.id}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { name, code, description }
      if (editing) {
        const res = await categoryAPI.update(editing.id, payload)
        if (res && res.data) {
          setCategories((c) => c.map((x) => (x.id === editing.id ? res.data : x)))
        }
      } else {
        const res = await categoryAPI.create(payload)
        if (res && res.data) setCategories((c) => [res.data, ...c])
        else if (res && res.id) setCategories((c) => [res as Category, ...c])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to save category')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return
    setError('')
    setMessage('')
    setActionLoading((s) => ({ ...s, [id]: true }))
    try {
      const res = await categoryAPI.remove(id)
      if (res && (res.success || res.message === undefined)) {
        setMessage('Category deleted')
        await fetchCategories()
      } else if (res && res.message) {
        setError(res.message)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to delete')
    } finally {
      setActionLoading((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className="p-6 main-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-dark">Master - Categories</h1>
        <div className="flex gap-2">
          <Link href="/masters/categories/new">
            <Button className="dashboard-add-btn">Add New Category</Button>
          </Link>
        </div>
      </div>

      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
      {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

      <div>
        <h2 className='text-lg font-medium mb-2'>All Categories</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className='overflow-auto'>
            <table className='w-full table-auto border dashboard-table'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 text-left'>Name</th>
                  <th className='p-2 text-left'>Code</th>
                  <th className='p-2 text-left'>Description</th>
                  <th className='p-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={4} className='p-4'>No categories found.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className='border-t'>
                      <td className='p-2'>{cat.name}</td>
                      <td className='p-2'>{cat.code}</td>
                      <td className='p-2'>{cat.description}</td>
                      <td className='p-2 flex gap-2 dashboard-actions'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(cat)} disabled={!!actionLoading[cat.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(cat.id)} disabled={!!actionLoading[cat.id]}>
                          {actionLoading[cat.id] ? '...' : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
