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

        // ── Build permission cache (two sources) ──────────────────────────────
        // SOURCE 1 (instant): verifyOTP response has user.permissions as a flat
        //   array of SLUG STRINGS  e.g. ["MasterApp-Center-Read", ...]
        //   auth.service.ts: allPermissions = roles.flatMap(r => r.permissions.map(p => p.slug))
        // SOURCE 2 (profile): /auth/profile now returns full user with
        //   roles[].permissions[] objects (since jwt.strategy.ts was fixed).
        //   This gives us .route, .httpMethod, .module fields.
        try {
          const apiRoutes: string[] = []

          // SOURCE 1 — permissions from verifyOTP response.
          // auth.service.ts now returns OBJECTS: { id, slug, route, httpMethod, module, action }
          // (older backend may still return plain strings — handle both shapes)
          const slugPerms: any[] = res.data?.user?.permissions || []
          slugPerms.forEach((p: any) => {
            if (!p) return
            if (typeof p === 'string') {
              // Old backend format: plain slug string
              if (!apiRoutes.includes(p)) apiRoutes.push(p)
            } else if (typeof p === 'object') {
              // New backend format: full permission object
              if (p.slug && !apiRoutes.includes(p.slug)) apiRoutes.push(p.slug)
              if (p.route && !apiRoutes.includes(p.route)) apiRoutes.push(p.route)
              if (p.httpMethod && p.route) {
                const tok = `${String(p.httpMethod).toLowerCase()} ${p.route}`
                if (!apiRoutes.includes(tok)) apiRoutes.push(tok)
              }
              if (p.module) {
                const mod = String(p.module).trim().toLowerCase()
                const path = `/${mod.endsWith('s') ? mod : mod + 's'}`
                if (!apiRoutes.includes(path)) apiRoutes.push(path)
                if (!apiRoutes.includes(`get ${path}`)) apiRoutes.push(`get ${path}`)
              }
            }
          })
          console.log('[Login] perms from verifyOTP:', slugPerms.length, '| apiRoutes so far:', apiRoutes)

          // SOURCE 2 — /auth/profile gives richer data; roles/roleNames fallback from verifyOTP response
          const loginRoles: any[] = res.data?.user?.roles || []
          let roleNames: string[] = loginRoles.map((r: any) => r.name).filter(Boolean)

          try {
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
              headers: { Authorization: `Bearer ${res.data.accessToken}` },
            })
            const profileData = await profileRes.json()
            const roles: any[] = profileData?.data?.roles || []
            // Override with profile role names if we got some
            if (roles.length > 0) roleNames = roles.map((r: any) => r.name)

            roles.forEach((r: any) => {
              (r.permissions || []).forEach((p: any) => {
                // p may be an object with route/slug/module, or just a string
                if (typeof p === 'string') {
                  if (!apiRoutes.includes(p)) apiRoutes.push(p)
                } else if (p && typeof p === 'object') {
                  if (p.route && !apiRoutes.includes(p.route)) apiRoutes.push(p.route)
                  if (p.slug && !apiRoutes.includes(p.slug)) apiRoutes.push(p.slug)
                  if (p.httpMethod && p.route) {
                    const tok = `${String(p.httpMethod).toLowerCase()} ${p.route}`
                    if (!apiRoutes.includes(tok)) apiRoutes.push(tok)
                  }
                  if (p.module) {
                    const mod = String(p.module).trim().toLowerCase()
                    const path = `/${mod.endsWith('s') ? mod : mod + 's'}`
                    if (!apiRoutes.includes(path)) { apiRoutes.push(path); apiRoutes.push(`get ${path}`) }
                  }
                }
              })
            })
            console.log('[Login] profile roles:', JSON.stringify(roles.map(r => ({ name: r.name, permCount: (r.permissions || []).length }))))
          } catch (profileErr) {
            // Profile fetch failed — slugs from verifyOTP still usable, role names from login response
            console.warn('[Login] profile fetch failed, using login response data:', profileErr)
          }

          console.log('[Login] final apiRoutes:', apiRoutes, '| roleNames:', roleNames)

          localStorage.setItem('userPermissions', JSON.stringify(apiRoutes))
          localStorage.setItem('userPermissions_ts', String(Date.now()))
          localStorage.setItem('userRoleNames', JSON.stringify(roleNames))
          localStorage.setItem('isAdmin', JSON.stringify(
            roleNames.some(n => n === 'Admin' || n === 'Organization Admin')
          ))
        } catch (e) {
          console.error('[Login] permission build failed:', e)
          localStorage.removeItem('userPermissions')
          localStorage.removeItem('userRoleNames')
          localStorage.setItem('isAdmin', 'false')
        }

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
