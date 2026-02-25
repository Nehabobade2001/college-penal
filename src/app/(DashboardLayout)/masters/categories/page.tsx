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
    <div className='listing-page'>
      <div className='listing-header'>
        <h1 className='listing-title'>Master – Categories</h1>
        <Link href='/masters/categories/new'>
          <Button className='dashboard-add-btn'>Add New Category</Button>
        </Link>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}
      {message && <div className='listing-alert-success'>{message}</div>}

      <p className='listing-subtitle'>All Categories</p>

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Name</th>
                <th className='listing-th'>Code</th>
                <th className='listing-th'>Description</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={5} className='listing-empty'>No categories found.</td></tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{cat.name}</td>
                    <td className='listing-td'>{cat.code}</td>
                    <td className='listing-td'>{cat.description}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={() => openEdit(cat)} disabled={!!actionLoading[cat.id]}>Edit</Button>
                        <Button variant='destructive' size='sm' onClick={() => handleDelete(cat.id)} disabled={!!actionLoading[cat.id]}>{actionLoading[cat.id] ? '...' : 'Delete'}</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
