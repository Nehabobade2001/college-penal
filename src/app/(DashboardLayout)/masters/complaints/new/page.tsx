"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { complaintAPI } from '@/lib/api'
import { Icon } from '@iconify/react'

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', icon: 'solar:arrow-down-bold', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { value: 'MEDIUM', label: 'Medium', icon: 'solar:minus-bold', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'HIGH', label: 'High', icon: 'solar:arrow-up-bold', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'URGENT', label: 'Urgent', icon: 'solar:danger-triangle-bold', color: 'text-red-600 bg-red-50 border-red-200' },
]

export default function NewComplaintPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idParam = searchParams?.get('id')
  const isEdit = !!idParam

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [studentId, setStudentId] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    const fetchComplaint = async () => {
      setLoading(true)
      try {
        const id = Number(idParam)
        if (!id) throw new Error('Invalid id')
        const res: any = await complaintAPI.get(id)
        const payload = res.data || res
        setTitle(payload.title || '')
        setDescription(payload.description || '')
        setStudentId(payload.studentId ? String(payload.studentId) : '')
        setPriority(payload.priority || 'MEDIUM')
      } catch (err: any) {
        setError(err?.message || 'Failed to load complaint')
      } finally {
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [idParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload: any = { title, description, priority }
      if (studentId) payload.studentId = Number(studentId)

      let res: any
      if (isEdit) {
        res = await complaintAPI.update(Number(idParam), payload)
      } else {
        res = await complaintAPI.create(payload)
      }

      if (res && (res.data || res.id || res.success)) {
        router.push('/masters/complaints')
        return
      }
      setError(res?.message || 'Failed to save complaint')
    } catch (err: any) {
      setError(err?.message || 'Failed to save complaint')
    } finally {
      setLoading(false)
    }
  }

  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority)

  return (
    <div className="listing-page">

      {/* ── Page Header ── */}
      <div className="listing-header">
        <div>
          <h1 className="listing-title">
            {isEdit ? 'Edit Complaint' : 'New Complaint'}
          </h1>
          <p className="listing-subtitle">
            {isEdit ? 'Update the complaint details below' : 'Fill in the details to raise a new complaint'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/masters/complaints')}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-defaultBorder text-bodytext hover:bg-lightprimary hover:text-primary hover:border-primary transition-all"
        >
          <Icon icon="solar:arrow-left-outline" width={16} />
          Back to List
        </button>
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div className="listing-alert-error flex items-center gap-2">
          <Icon icon="solar:danger-circle-outline" width={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="listing-alert-success flex items-center gap-2">
          <Icon icon="solar:check-circle-outline" width={16} />
          {success}
        </div>
      )}

      {/* ── Form Card ── */}
      <div className="form-card">

        {/* Card header strip */}
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-defaultBorder">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#8B1A1A' }}
          >
            <Icon icon="solar:document-add-bold-duotone" width={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-dark">
              Complaint Details
            </h2>
            <p className="text-xs text-bodytext mt-0.5">All fields marked * are required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-dark">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Icon
                icon="solar:text-field-focus-outline"
                width={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bodytext pointer-events-none"
              />
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a short, descriptive title"
                required
                className="form-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-dark">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the complaint in detail..."
              required
              rows={4}
              className="form-textarea w-full resize-none"
            />
          </div>

          {/* Student ID */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-dark">
              Student ID
              <span className="ml-2 text-xs font-normal text-bodytext">(optional)</span>
            </label>
            <div className="relative">
              <Icon
                icon="solar:user-id-outline"
                width={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bodytext pointer-events-none"
              />
              <input
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="Enter numeric student ID"
                type="number"
                min={1}
                className="form-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all
                    ${priority === opt.value
                      ? `${opt.color} ring-2 ring-offset-1 ${opt.value === 'LOW' ? 'ring-emerald-400' : opt.value === 'MEDIUM' ? 'ring-amber-400' : opt.value === 'HIGH' ? 'ring-orange-400' : 'ring-red-400'}`
                      : 'bg-white border-defaultBorder text-bodytext hover:border-primary hover:text-primary'
                    }`}
                >
                  <Icon icon={opt.icon} width={15} />
                  {opt.label}
                </button>
              ))}
            </div>
            {selectedPriority && (
              <p className="text-xs text-bodytext flex items-center gap-1 mt-1">
                <Icon icon="solar:info-circle-outline" width={13} />
                Selected: <strong>{selectedPriority.label}</strong>
              </p>
            )}
          </div>

          {/* ── Footer Actions ── */}
          <div className="flex items-center gap-3 pt-4 border-t border-defaultBorder">
            <button
              type="submit"
              disabled={loading}
              className="dashboard-add-btn flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon icon="solar:refresh-outline" width={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon icon="solar:check-circle-bold" width={16} />
                  {isEdit ? 'Update Complaint' : 'Submit Complaint'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/masters/complaints')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-defaultBorder text-sm font-semibold text-bodytext hover:bg-lightprimary hover:text-primary hover:border-primary transition-all"
            >
              <Icon icon="solar:close-circle-outline" width={16} />
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
