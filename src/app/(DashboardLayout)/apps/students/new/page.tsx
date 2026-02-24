'use client'

import React, { useEffect, useState } from 'react'
import { studentAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export default function StudentFormPage() {
  const [name, setName] = useState('')
  // Basic Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [stateVal, setStateVal] = useState('')
  const [pincode, setPincode] = useState('')

  // Academic Information
  const [enrollmentNumber, setEnrollmentNumber] = useState('')
  const [courseName, setCourseName] = useState('')
  const [branch, setBranch] = useState('')
  const [semester, setSemester] = useState('')
  const [admissionDate, setAdmissionDate] = useState('')
  const [sessionYear, setSessionYear] = useState('')

  // Documents
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [previousMarksheetUrl, setPreviousMarksheetUrl] = useState('')
  const [category, setCategory] = useState('')

  // Status
  const [status, setStatus] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const router = useRouter()
  const params = useSearchParams()
  const id = params?.get('id')

  const fetchStudent = async (idVal: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/students/${idVal}`)
      const data = await res.json()
      if (data) {
        // Map backend fields to form
        setFirstName(data.firstName || data.name || '')
        setLastName(data.lastName || '')
        setGender(data.gender || '')
        setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '')
        setEmail(data.email || '')
        setMobileNumber(data.mobileNumber || '')
        setAddress(data.address || '')
        setCity(data.city || '')
        setStateVal(data.state || '')
        setPincode(data.pincode || '')

        setEnrollmentNumber(data.enrollmentNumber || '')
        setCourseName(data.courseName || '')
        setBranch(data.branch || '')
        setSemester(data.semester ? String(data.semester) : '')
        setAdmissionDate(data.admissionDate ? data.admissionDate.split('T')[0] : '')
        setSessionYear(data.sessionYear || '')

        setProfilePhotoUrl(data.profilePhoto || data.profilePhotoUrl || '')
        setAadhaarNumber(data.aadhaarNumber || '')
        setPreviousMarksheetUrl(data.previousMarksheet || data.previousMarksheetUrl || '')
        setCategory(data.category || 'General')

        setStatus(data.status || 'Active')
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    if (id) fetchStudent(id)
  }, [id])

  const validateForm = () => {
    const e: Record<string, string> = {}
    if (!firstName || firstName.trim().length === 0) e.firstName = 'First name is required'
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!enrollmentNumber || enrollmentNumber.trim().length === 0) e.enrollmentNumber = 'Enrollment number is required'
    if (!courseName || courseName.trim().length === 0) e.courseName = 'Course name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) {
      setError('Please fix validation errors')
      return
    }
    setMessage('')
    setLoading(true)
    try {
      const payload: any = {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        email,
        mobileNumber,
        address,
        city,
        state: stateVal,
        pincode,

        enrollmentNumber,
        courseName,
        branch,
        semester: semester ? Number(semester) : undefined,
        admissionDate,
        sessionYear,

        profilePhoto: profilePhotoUrl,
        aadhaarNumber,
        previousMarksheet: previousMarksheetUrl,
        category,

        status,
      }
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
      <div className='form-card'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-semibold text-dark'>{id ? 'Edit Student' : 'Add Student'}</h1>
        </div>

        {error && <div className='mb-4 p-2 bg-red-100 text-red-700 rounded'>{error}</div>}
        {message && <div className='mb-4 p-2 bg-green-100 text-green-800 rounded'>{message}</div>}

        <form onSubmit={handleSubmit} className='max-w-4xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <h2 className='text-lg font-semibold text-dark mb-1'>Basic Information</h2>
              <p className='text-sm text-slate-600 mb-4'>Personal details for the student.</p>
            </div>
            <div>
              <label className='block mb-2 text-sm text-slate-800'>First Name</label>
              <input placeholder='First Name' className='form-input' value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
              {errors.firstName && <div className='text-sm text-red-400 mt-1'>{errors.firstName}</div>}
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Last Name</label>
              <input placeholder='Last Name' className='form-input' value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Gender</label>
              <select className='form-select' value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value='' disabled>Select</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Date of Birth</label>
              <input type='date' className='form-input' value={dateOfBirth} onChange={(e)=>setDateOfBirth(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Email</label>
              <input placeholder='name@example.com' type='email' className='form-input' value={email} onChange={(e)=>setEmail(e.target.value)} />
              {errors.email && <div className='text-sm text-red-400 mt-1'>{errors.email}</div>}
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Mobile Number</label>
              <input placeholder='9876543210' className='form-input' value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} />
            </div>

            <div className='md:col-span-2'>
              <label className='block mb-2 text-sm text-slate-800'>Address</label>
              <textarea placeholder='House, street, area' className='form-textarea' value={address} onChange={(e)=>setAddress(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>City</label>
              <input placeholder='City' className='form-input' value={city} onChange={(e)=>setCity(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>State</label>
              <input placeholder='State' className='form-input' value={stateVal} onChange={(e)=>setStateVal(e.target.value)} />
            </div>

            <div className='md:col-span-2'>
              <h2 className='text-lg font-semibold text-dark mb-1'>Academic Information</h2>
              <p className='text-sm text-slate-600 mb-4'>Enrollment, course and session details.</p>
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Pincode</label>
              <input placeholder='Pincode' className='form-input' value={pincode} onChange={(e)=>setPincode(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Enrollment Number</label>
              <input placeholder='Enrollment number' className='form-input' value={enrollmentNumber} onChange={(e)=>setEnrollmentNumber(e.target.value)} />
              {errors.enrollmentNumber && <div className='text-sm text-red-400 mt-1'>{errors.enrollmentNumber}</div>}
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Course Name</label>
              <input placeholder='Course name (e.g. B.Sc Computer Science)' className='form-input' value={courseName} onChange={(e)=>setCourseName(e.target.value)} />
              {errors.courseName && <div className='text-sm text-red-400 mt-1'>{errors.courseName}</div>}
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Branch</label>
              <input placeholder='Branch / specialization' className='form-input' value={branch} onChange={(e)=>setBranch(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Semester</label>
              <input placeholder='Semester number' type='number' className='form-input' value={semester} onChange={(e)=>setSemester(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Admission Date</label>
              <input placeholder='Admission date' type='date' className='form-input' value={admissionDate} onChange={(e)=>setAdmissionDate(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Session Year</label>
              <input placeholder='2025-2026' className='form-input' value={sessionYear} onChange={(e)=>setSessionYear(e.target.value)} />
            </div>

            <div className='md:col-span-2'>
              <h2 className='text-lg font-semibold text-dark mb-1'>Documents</h2>
              <p className='text-sm text-slate-600 mb-4'>Upload profile photo and previous marksheets. Files are stored and a preview link will appear.</p>
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Profile Photo</label>
              <input className='form-input' type='file' onChange={async (e)=>{
                const file = e.target.files?.[0]
                if (!file) return
                const form = new FormData()
                form.append('file', file)
                try {
                  const uplRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/files/upload`, { method: 'POST', body: form })
                  const data = await uplRes.json()
                  if (data && data.files && data.files.length>0) setProfilePhotoUrl(data.files[0])
                } catch(err){ console.error('Upload failed', err) }
              }} />
              {profilePhotoUrl && <a className='text-blue-400 underline text-sm' href={profilePhotoUrl} target='_blank' rel='noreferrer'>View</a>}
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Aadhaar Number</label>
              <input className='form-input' value={aadhaarNumber} onChange={(e)=>setAadhaarNumber(e.target.value)} />
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Previous Marksheet</label>
              <input className='form-input' type='file' onChange={async (e)=>{
                const file = e.target.files?.[0]
                if (!file) return
                const form = new FormData()
                form.append('file', file)
                try {
                  const uplRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/files/upload`, { method: 'POST', body: form })
                  const data = await uplRes.json()
                  if (data && data.files && data.files.length>0) setPreviousMarksheetUrl(data.files[0])
                } catch(err){ console.error('Upload failed', err) }
              }} />
              {previousMarksheetUrl && <a className='text-blue-400 underline text-sm' href={previousMarksheetUrl} target='_blank' rel='noreferrer'>View</a>}
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Category</label>
              <select className='form-select' value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value='' disabled>Select category</option>
                <option value='General'>General</option>
                <option value='OBC'>OBC</option>
                <option value='SC'>SC</option>
                <option value='ST'>ST</option>
              </select>
            </div>

            <div>
              <label className='block mb-2 text-sm text-slate-800'>Status</label>
              <select className='form-select' value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option value='' disabled>Select status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Graduated</option>
              </select>
            </div>
          </div>

          <div className='flex gap-2 mt-6'>
            <Button type='submit' className='dashboard-add-btn' disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            <Button variant='outline' onClick={() => router.push('/apps/students')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
