'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

// ── types ──────────────────────────────────────────────────────────────────
interface Stats {
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  totalCenters: number
  totalCourses: number
  totalFees: number
  totalPaidFees: number
  totalPendingFees: number
}

// ── helper ─────────────────────────────────────────────────────────────────
function getToken() {
  if (typeof document === 'undefined') return ''
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  )
}

function getUserName() {
  if (typeof document === 'undefined') return 'Admin'
  const match = document.cookie.match(/(?:^|;)\s*userName=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : 'Admin'
}

function getUserRole() {
  if (typeof document === 'undefined') return 'Administrator'
  const match = document.cookie.match(/(?:^|;)\s*userRole=([^;]*)/)
  if (!match) return 'Administrator'
  const r = decodeURIComponent(match[1])
  return r.charAt(0).toUpperCase() + r.slice(1)
}

// ── StatCard component ─────────────────────────────────────────────────────
type CardVariant = 'green' | 'red' | 'blue' | 'yellow' | 'maroon'

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  sub: string
  trend: 'up' | 'down'
  variant: CardVariant
}

const variantStyles: Record<CardVariant, { bg: string; iconBg: string; iconColor: string; trendBg: string; trendColor: string }> = {
  green: { bg: 'bg-white dark:bg-darkgray border-defaultBorder dark:border-darkborder', iconBg: 'bg-emerald-100 dark:bg-emerald-800/30', iconColor: 'text-emerald-600 dark:text-emerald-400', trendBg: 'bg-emerald-100 dark:bg-emerald-800/30', trendColor: 'text-emerald-600 dark:text-emerald-400' },
  red: { bg: 'bg-white dark:bg-darkgray border-defaultBorder dark:border-darkborder', iconBg: 'bg-rose-100 dark:bg-rose-800/30', iconColor: 'text-rose-500 dark:text-rose-400', trendBg: 'bg-rose-100 dark:bg-rose-800/30', trendColor: 'text-rose-500 dark:text-rose-400' },
  blue: { bg: 'bg-white dark:bg-darkgray border-defaultBorder dark:border-darkborder', iconBg: 'bg-blue-100 dark:bg-blue-800/30', iconColor: 'text-blue-500 dark:text-blue-400', trendBg: 'bg-blue-100 dark:bg-blue-800/30', trendColor: 'text-blue-500 dark:text-blue-400' },
  yellow: { bg: 'bg-white dark:bg-darkgray border-defaultBorder dark:border-darkborder', iconBg: 'bg-amber-100 dark:bg-amber-800/30', iconColor: 'text-amber-600 dark:text-amber-400', trendBg: 'bg-amber-100 dark:bg-amber-800/30', trendColor: 'text-amber-600 dark:text-amber-400' },
  maroon: { bg: 'bg-white dark:bg-darkgray border-defaultBorder dark:border-darkborder', iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-700 dark:text-red-400', trendBg: 'bg-red-100 dark:bg-red-900/30', trendColor: 'text-red-700 dark:text-red-400' },
}

function StatCard({ icon, label, value, sub, trend, variant }: StatCardProps) {
  const s = variantStyles[variant]
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 ${s.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg}`}>
            <Icon icon={icon} width={18} className={s.iconColor} />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${s.trendBg}`}>
          <Icon
            icon={trend === 'up' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'}
            width={14}
            className={s.trendColor}
          />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-dark dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalCenters: 0,
    totalCourses: 0,
    totalFees: 0,
    totalPaidFees: 0,
    totalPendingFees: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Admin')
  const [userRole, setUserRole] = useState('Administrator')

  useEffect(() => {
    setUserName(getUserName())
    setUserRole(getUserRole())

    const token = getToken()
    if (!token) { setLoading(false); return }

    const headers: Record<string, string> = { Authorization: `Bearer ${token}` }
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

    Promise.all([
      fetch(`${API}/students`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/centers`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/courses`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/fees/payments`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([studentsRes, centersRes, coursesRes, paymentsRes]) => {
      const students: any[] = Array.isArray(studentsRes?.data) ? studentsRes.data : (Array.isArray(studentsRes) ? studentsRes : [])
      const centers: any[] = Array.isArray(centersRes?.data) ? centersRes.data : (Array.isArray(centersRes) ? centersRes : [])
      const courses: any[] = Array.isArray(coursesRes?.data) ? coursesRes.data : (Array.isArray(coursesRes) ? coursesRes : [])
      const payments: any[] = Array.isArray(paymentsRes?.data) ? paymentsRes.data : (Array.isArray(paymentsRes) ? paymentsRes : [])

      const active = students.filter((s: any) => s.isActive || s.status === 'active').length
      const inactive = students.length - active

      const totalFees = payments.reduce((acc: number, p: any) => acc + (parseFloat(p.amount) || 0), 0)
      const paidFees = payments.filter((p: any) => p.status === 'approved' || p.status === 'paid').reduce((acc: number, p: any) => acc + (parseFloat(p.amount) || 0), 0)
      const pendingFees = totalFees - paidFees

      setStats({
        totalStudents: students.length,
        activeStudents: active,
        inactiveStudents: inactive,
        totalCenters: centers.length,
        totalCourses: courses.length,
        totalFees,
        totalPaidFees: paidFees,
        totalPendingFees: pendingFees,
      })
    }).finally(() => setLoading(false))
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n)

  return (
    <div className="space-y-7">

      {/* ── Welcome Banner ───────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, #fff8f5 0%, #fdf0ea 50%, #f5f9f5 100%)',
          border: '1px solid #e8ddd5',
          boxShadow: '0 2px 16px rgba(139,26,26,0.07)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#8B1A1A' }}
          >
            <Icon icon="solar:user-bold-duotone" width={30} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1C0A00' }}>
              Welcome {userName}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#6B4F3A' }}>
              Manage your college platform efficiently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
            style={{ background: '#ffffff', borderColor: '#e8ddd5', color: '#2C1810' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {userRole} Dashboard
          </div>
          <button
            className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-lightprimary transition-colors"
            style={{ borderColor: '#e8ddd5', background: '#ffffff' }}
            onClick={() => window.location.reload()}
            title="Refresh"
          >
            <Icon icon="solar:refresh-outline" width={16} style={{ color: '#8B1A1A' }} />
          </button>
        </div>
      </div>

      {/* ── Stats Section ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold" style={{ color: '#1C0A00' }}>
            Detailed Statistics
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#8B1A1A' }}>
            <Icon icon="solar:chart-2-outline" width={14} />
            All Metrics
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-defaultBorder bg-white dark:bg-darkgray p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                <div className="h-4 w-20 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="solar:users-group-rounded-outline"
              label="Total Students"
              value={stats.totalStudents}
              sub="All Students"
              trend="up"
              variant="green"
            />
            <StatCard
              icon="solar:user-check-rounded-outline"
              label="Active Students"
              value={stats.activeStudents}
              sub="Currently Active"
              trend="up"
              variant="blue"
            />
            <StatCard
              icon="solar:user-cross-rounded-outline"
              label="Inactive Students"
              value={stats.inactiveStudents}
              sub="Inactive"
              trend="down"
              variant="red"
            />
            <StatCard
              icon="solar:buildings-2-outline"
              label="Total Centers"
              value={stats.totalCenters}
              sub="Registered Centers"
              trend="up"
              variant="yellow"
            />
            <StatCard
              icon="solar:book-2-outline"
              label="Total Courses"
              value={stats.totalCourses}
              sub="Available Courses"
              trend="up"
              variant="maroon"
            />
            <StatCard
              icon="solar:wallet-money-outline"
              label="Total Fees Collected"
              value={`₹${fmt(stats.totalFees)}`}
              sub="All Transactions"
              trend="up"
              variant="green"
            />
            <StatCard
              icon="solar:check-circle-outline"
              label="Paid Fees"
              value={`₹${fmt(stats.totalPaidFees)}`}
              sub="Approved Payments"
              trend="up"
              variant="blue"
            />
            <StatCard
              icon="solar:clock-circle-outline"
              label="Pending Fees"
              value={`₹${fmt(stats.totalPendingFees)}`}
              sub="Awaiting Approval"
              trend="down"
              variant="red"
            />
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <p className="text-center text-xs pb-2" style={{ color: '#9B8070' }}>
        Copyright © {new Date().getFullYear()} College Management System. All rights reserved.
      </p>
    </div>
  )
}
