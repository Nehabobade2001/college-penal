'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FullLogo from '@/app/(DashboardLayout)/layout/shared/logo/FullLogo'
import CardBox from '../shared/CardBox'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authAPI } from '@/lib/api'
import { OTPInput } from 'input-otp'

export const Login = () => {
  const router = useRouter()
  const [role, setRole] = useState<'admin' | 'franchise' | 'student'>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.requestOTP(role, email, password)
      if (res.otpGeneratedSuccessfully) {
        setShowOTP(true)
      } else {
        setError(res.message || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.verifyOTP(role, email, password, parseInt(otp))
      if (res.data && res.data.accessToken) {
        const expires = new Date(Date.now() + 86400000).toUTCString()
        document.cookie = `accessToken=${res.data.accessToken}; path=/; expires=${expires}`
        document.cookie = `userRole=${role}; path=/; expires=${expires}`
        window.location.href = '/'
      } else {
        setError(res.message || 'Invalid OTP')
        setLoading(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }
  return (
    <div className='h-screen w-full flex justify-center items-center bg-lightprimary'>
      <div className='md:min-w-[450px] min-w-max'>
        <CardBox>
          <div className='flex justify-center mb-4'>
            <FullLogo />
          </div>
          <p className='text-sm text-charcoal text-center mb-6'>
            Your Social Campaigns
          </p>
          
          {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
          
          <form onSubmit={showOTP ? handleVerifyOTP : handleRequestOTP}>
            {!showOTP ? (
              <>
                <div className='mb-4'>
                  <Label htmlFor='role' className='font-medium'>Role</Label>
                  <Select value={role} onValueChange={(v: any) => setRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='admin'>Admin</SelectItem>
                      <SelectItem value='franchise'>Franchise</SelectItem>
                      <SelectItem value='student'>Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='mb-4'>
                  <Label htmlFor='email' className='font-medium'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <Label htmlFor='password' className='font-medium'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                  />
                </div>
                <div className='flex flex-wrap gap-6 items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <Checkbox id='remember' />
                    <Label className='text-link font-normal text-sm' htmlFor='remember'>
                      Remember this device
                    </Label>
                  </div>
                  <Link href='#' className='text-sm font-medium text-primary hover:text-primaryemphasis'>
                    Forgot Password ?
                  </Link>
                </div>
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? 'Sending...' : 'Request OTP'}
                </Button>
              </>
            ) : (
              <>
                <div className='mb-4'>
                  <Label className='font-medium'>Enter OTP</Label>
                  <div className='flex justify-center mt-2'>
                    <OTPInput
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      containerClassName='flex gap-2'
                      render={({ slots }) => (
                        <>
                          {slots.map((slot, idx) => (
                            <div
                              key={idx}
                              className='w-12 h-12 border-2 rounded-md flex items-center justify-center text-lg font-semibold'
                            >
                              {slot.char || ''}
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </div>
                </div>
                <Button type='submit' className='w-full mb-2' disabled={loading || otp.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button type='button' variant='outline' className='w-full' onClick={() => setShowOTP(false)}>
                  Back
                </Button>
              </>
            )}
          </form>
          
          <div className='flex items center gap-2 justify-center mt-6 flex-wrap'>
            <p className='text-base font-medium text-link dark:text-darklink'>
              New to Matdash?
            </p>
            <Link href='/auth/register' className='text-sm font-medium text-primary hover:text-primaryemphasis'>
              Create an account
            </Link>
          </div>
        </CardBox>
      </div>
    </div>
  )
}
