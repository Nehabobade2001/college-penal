import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import SidebarContent from './Sidebaritems'
import SimpleBar from 'simplebar-react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import {
  AMLogo,
  AMMenu,
  AMMenuItem,
  AMSidebar,
  AMSubmenu,
} from 'tailwind-sidebar'
import 'tailwind-sidebar/styles.css'
import { usePermissionsContext } from '@/context/PermissionsContext'

/**
 * Returns true if the item should be visible given the user's allowed apiRoutes.
 * - If isAdmin is true         → Admin → show everything
 * - If item has no apiRoute    → always visible (dashboard, headings, etc.)
 * - Otherwise                  → show only if the item's apiRoute is in allowedRoutes
 */
function isItemAllowed(item: any, allowedRoutes: string[], isAdmin: boolean): boolean {
  if (isAdmin) return true          // Admin — unrestricted
  if (!item.apiRoute) return true   // No annotation → always visible

  const normalize = (r: string) => {
    try {
      const s = r.trim().toLowerCase()
      if (s.includes(' ')) {
        const [, path] = s.split(/\s+/, 2)
        return [s, path.replace(/\?.*$/, '').replace(/\/$/, '')]
      }
      return [s.replace(/\?.*$/, '').replace(/\/$/, '')]
    } catch {
      return [r]
    }
  }

  const normalizeToken = (t: string) => String(t || '').toLowerCase().replace(/[^a-z0-9\/]/g, '')

  const rawItemRoutes: any[] = []
  if (item.apiRoute) rawItemRoutes.push(...(Array.isArray(item.apiRoute) ? item.apiRoute : [item.apiRoute]))
  if (item.route) rawItemRoutes.push(item.route)
  if (item.slug) rawItemRoutes.push(item.slug)
  if (item.url && typeof item.url === 'string') rawItemRoutes.push(item.url)

  const itemForms = rawItemRoutes.flatMap((ir) => (typeof ir === 'string' ? normalize(ir) : []))
  const allowedSet = new Set<string>()
  allowedRoutes.forEach((ar) => normalize(ar).forEach((x) => allowedSet.add(x)))

  if (itemForms.some((f) => allowedSet.has(f))) return true

  // Temporary debug: if this is the Centers item, log matching details
  try {
    const isCenterItem = String(item.name || '').toLowerCase().includes('center') || String(item.url || '').toLowerCase().includes('/apps/centers')
    if (isCenterItem) {
      console.log('[Sidebar debug] item:', item.name, 'rawItemRoutes:', rawItemRoutes)
      console.log('[Sidebar debug] itemForms:', itemForms)
      console.log('[Sidebar debug] allowedRoutes:', allowedRoutes)
      console.log('[Sidebar debug] allowedSet sample:', Array.from(allowedSet).slice(0,20))
    }
  } catch {}

  try {
    const allowedNorm = new Set(allowedRoutes.map((ar) => normalizeToken(String(ar))))
    for (const raw of rawItemRoutes) {
      const r = normalizeToken(String(raw))
      if (!r) continue
      // Exact token match
      if (allowedNorm.has(r)) return true
      // Fallback: allow if any allowed token contains the item token or vice-versa
      for (const a of allowedNorm) {
        if (!a) continue
        if (a.includes(r) || r.includes(a)) return true
      }
    }
  } catch { }

  return false
}

/**
 * Recursively filters sidebar items.
 * A parent (submenu) is visible if at least one child passes the filter.
 */
function filterItems(items: any[], allowedRoutes: string[], isAdmin: boolean): any[] {
  return items.reduce<any[]>((acc, item) => {
    if (item.heading) {
      acc.push(item)
      return acc
    }
    if (item.children?.length) {
      const filteredChildren = filterItems(item.children, allowedRoutes, isAdmin)
      if (filteredChildren.length > 0) {
        acc.push({ ...item, children: filteredChildren })
      }
      return acc
    }
    if (isItemAllowed(item, allowedRoutes, isAdmin)) {
      acc.push(item)
    }
    return acc
  }, [])
}

const renderSidebarItems = (
  items: any[],
  currentPath: string,
  onClose?: () => void,
  isSubItem: boolean = false
) => {
  return items.map((item, index) => {
    const isSelected = currentPath === item?.url
    const IconComp = item.icon || null

    const iconElement = IconComp ? (
      <Icon icon={IconComp} height={21} width={21} />
    ) : (
      <Icon icon={'ri:checkbox-blank-circle-line'} height={9} width={9} />
    )

    if (item.heading) {
      return (
        <div className='mb-1' key={item.heading}>
          <AMMenu
            subHeading={item.heading}
            ClassName='hide-menu leading-21 text-charcoal font-bold uppercase text-xs dark:text-darkcharcoal'
          />
        </div>
      )
    }

    if (item.children?.length) {
      return (
        <AMSubmenu
          key={item.id}
          icon={iconElement}
          title={item.name}
          ClassName='mt-1.5 text-link dark:text-darklink'>
          {renderSidebarItems(item.children, currentPath, onClose, true)}
        </AMSubmenu>
      )
    }

    const linkTarget = item.url?.startsWith('https') ? '_blank' : '_self'

    const itemClassNames = isSubItem
      ? `mt-1.5 text-link dark:text-darklink !hover:bg-transparent ${isSelected ? '!bg-transparent !text-primary' : ''
      } !px-1.5 `
      : `hover:bg-lightprimary! hover:text-primary! mt-1.5 text-link dark:text-darklink ${isSelected ? '!bg-lightprimary !text-primary !hover-bg-lightprimary' : ' '}`

    return (
      <div onClick={onClose} key={index}>
        <AMMenuItem
          key={item.id}
          icon={iconElement}
          isSelected={isSelected}
          link={item.url || undefined}
          target={linkTarget}
          badge={!!item.isPro}
          badgeColor='bg-lightsecondary'
          badgeTextColor='text-secondary'
          disabled={item.disabled}
          badgeContent={item.isPro ? 'Pro' : undefined}
          component={Link}
          className={`${itemClassNames}`}>
          <span className='truncate flex-1'>{item.title || item.name}</span>
        </AMMenuItem>
      </div>
    )
  })
}

/** Skeleton shimmer shown while permissions are loading */
const SidebarSkeleton = () => (
  <div className='px-6 py-4 animate-pulse space-y-3'>
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className='h-8 rounded-lg bg-gray-200 dark:bg-gray-700'
        style={{ width: `${70 + (i % 3) * 10}%`, opacity: 1 - i * 0.08 }}
      />
    ))}
  </div>
)

const SidebarLayout = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname()
  const { theme } = useTheme()
  const { permissions, isLoading, isAdmin } = usePermissionsContext()

  const sidebarMode = theme === 'light' || theme === 'dark' ? theme : undefined

  // Use empty array while loading so we don't flash wrong items
  const allowedRoutes: string[] = permissions ?? []

  return (
    <AMSidebar
      collapsible='none'
      animation={true}
      showProfile={false}
      width={'270px'}
      showTrigger={false}
      mode={sidebarMode}
      className='fixed left-0 top-0 xl:top-[1px] border-none bg-background z-10 h-screen'>

      {/* Logo */}
      <div className='px-4 flex items-center brand-logo overflow-hidden'>
        <AMLogo component={Link} href='/' img=''>
          <Image
            src="/images/dashboard/logo.jpeg"
            alt="logo"
            width={135}
            height={40}
            className="rtl:scale-x-[-1]"
          />
        </AMLogo>
      </div>

      {/* Sidebar items */}
      <SimpleBar className='h-[calc(100vh-170px)]'>
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <div className='px-6'>
            {SidebarContent.map((section, index) => {
              const filteredChildren = filterItems(section.children || [], allowedRoutes, isAdmin)
              if (filteredChildren.length === 0) return null

              return (
                <div key={index}>
                  {renderSidebarItems(
                    [
                      ...(section.heading ? [{ heading: section.heading }] : []),
                      ...filteredChildren,
                    ],
                    pathname,
                    onClose
                  )}
                </div>
              )
            })}

            {/* Promo Section */}
            <div className='mt-9  overflow-hidden'>
              <div className='flex items-center w-full bg-lightprimary rounded-lg p-6'>
                <div className='lg:w-1/2 w-full'>
                  <h5 className='text-base text-charcoal'>Check Pro Version</h5>
                  <Link href="https://adminmart.com/product/matdash-next-js-admin-dashboard-template/?ref=56#product-demo-section" target="_blank">
                    <Button className='whitespace-nowrap mt-2 text-[13px]'>
                      Check
                    </Button>
                  </Link>
                </div>
                <div className='lg:w-1/2 w-full -mt-4 ml-[26px] scale-[1.2] shrink-0'>
                  <Image
                    src={'/images/backgrounds/upgrade.png'}
                    alt='rocket'
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </SimpleBar>
    </AMSidebar>
  )
}

export default SidebarLayout
