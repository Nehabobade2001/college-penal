"use client"

import React, { useEffect, useState } from 'react'
import { resultAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

type ResultItem = {
  id: number
  studentName?: string
  course?: any
  examName?: string
  status?: string
  isPublished?: boolean
}

const ResultsApp: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState('')

  const fetchResults = async () => {
    setLoading(true)
    try {
      const res = await resultAPI.list()
      if (res && res.data) setResults(res.data)
      else if (Array.isArray(res)) setResults(res)
    } catch (e) {
      console.error(e)
      setError('Failed to load results')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchResults() }, [])

  const handlePublishToggle = async (id: number, publish: boolean) => {
    setActionLoading(s => ({ ...s, [id]: true }))
    try {
      await resultAPI.publish(id, publish)
      await fetchResults()
    } catch (e) { console.error(e); setError('Failed to change publish status') }
    finally { setActionLoading(s => ({ ...s, [id]: false })) }
  }

  const handleDownload = async (id: number) => {
    setActionLoading(s => ({ ...s, [id]: true }))
    try {
      const blob = await resultAPI.downloadPDF(id)
      // In-browser download without external dependency
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `result-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) { console.error(e); setError('Failed to download') }
    finally { setActionLoading(s => ({ ...s, [id]: false })) }
  }

  const handleApprove = async (id: number) => {
    // Approve is modelled as publish(true) for simplicity
    await handlePublishToggle(id, true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this result?')) return
    setActionLoading(s => ({ ...s, [id]: true }))
    try {
      const res = await resultAPI.remove(id)
      if (res && (res.success || res.message === undefined)) await fetchResults()
    } catch (e) { console.error(e); setError('Failed to delete') }
    finally { setActionLoading(s => ({ ...s, [id]: false })) }
  }

  return (
    <div>
      <div className='listing-header'>
        <h1 className='listing-title'>Result Management</h1>
      </div>

      {error && <div className='listing-alert-error'>{error}</div>}

      {loading ? (
        <div className='listing-loading'>Loading...</div>
      ) : (
        <div className='listing-card overflow-x-auto'>
          <table className='listing-table'>
            <thead className='listing-thead'>
              <tr>
                <th className='listing-th'>S.No</th>
                <th className='listing-th'>Student</th>
                <th className='listing-th'>Course</th>
                <th className='listing-th'>Exam</th>
                <th className='listing-th'>Status</th>
                <th className='listing-th'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan={6} className='listing-empty'>No results found.</td></tr>
              ) : (
                results.map((r, idx) => (
                  <tr key={r.id} className='listing-tbody-tr'>
                    <td className='listing-td'>{idx + 1}</td>
                    <td className='listing-td'>{r.studentName ?? ''}</td>
                    <td className='listing-td'>{r.course?.name ?? ''}</td>
                    <td className='listing-td'>{r.examName ?? ''}</td>
                    <td className='listing-td'>{r.isPublished ? 'Published' : r.status ?? 'Draft'}</td>
                    <td className='listing-td-actions'>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={() => handleApprove(r.id)} disabled={!!actionLoading[r.id]}>Approve</Button>
                        {r.isPublished ? (
                          <Button size='sm' variant='destructive' onClick={() => handlePublishToggle(r.id, false)} disabled={!!actionLoading[r.id]}>Unpublish</Button>
                        ) : (
                          <Button size='sm' onClick={() => handlePublishToggle(r.id, true)} disabled={!!actionLoading[r.id]}>Publish</Button>
                        )}
                        <Button size='sm' variant='secondary' onClick={() => handleDownload(r.id)} disabled={!!actionLoading[r.id]}>Download</Button>
                        <Button size='sm' variant='destructive' onClick={() => handleDelete(r.id)} disabled={!!actionLoading[r.id]}>Delete</Button>
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

export default ResultsApp
