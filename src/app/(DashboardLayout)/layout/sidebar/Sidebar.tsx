import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import SidebarContent from './Sidebaritems'
import SimpleBar from 'simplebar-react'
import { Icon } from '@iconify/react'
import FullLogo from '../shared/logo/FullLogo'
import { Button } from '@/components/ui/button'
import {
  AMLogo,
  AMMenu,
  AMMenuItem,
  AMSidebar,
  AMSubmenu,
} from 'tailwind-sidebar'
import 'tailwind-sidebar/styles.css'
import { usePermissions } from '@/hooks/usePermissions'

/**
 * Returns true if the item should be visible given the user's allowed apiRoutes.
 * - If allowedRoutes is null  → Admin / no data → show everything
 * - If item has no apiRoute   → always visible (dashboard, headings, etc.)
 * - Otherwise                 → show only if the item's apiRoute is in allowedRoutes
 */
function isItemAllowed(item: any, allowedRoutes: string[] | null): boolean {
  if (allowedRoutes === null) return true // Admin — no restriction
  if (!item.apiRoute) return true // No annotation → always visible

  // Normalize a route string for comparison.
  // Accepts formats like "GET /centers" or just "/centers".
  const normalize = (r: string) => {
    try {
      const s = r.trim().toLowerCase()
      // If includes method, keep both forms (with and without method)
      if (s.includes(' ')) {
        const [, path] = s.split(/\s+/, 2)
        return [s, path.replace(/\?.*$/, '').replace(/\/$/, '')]
      }
      return [s.replace(/\?.*$/, '').replace(/\/$/, '')]
    } catch {
      return [r]
    }
  }

  // More tolerant token normalizer for slug-style permissions (remove punctuation)
  const normalizeToken = (t: string) => String(t || '').toLowerCase().replace(/[^a-z0-9\/]/g, '')

  // Collect possible permission tokens from the sidebar item.
  // Backend permissions sometimes appear as `apiRoute`, `route` or `slug`.
  const rawItemRoutes: any[] = []
  if (item.apiRoute) rawItemRoutes.push(...(Array.isArray(item.apiRoute) ? item.apiRoute : [item.apiRoute]))
  if (item.route) rawItemRoutes.push(item.route)
  if (item.slug) rawItemRoutes.push(item.slug)
  // Also include the item url path as a last-resort token (e.g. '/apps/centers')
  if (item.url && typeof item.url === 'string') rawItemRoutes.push(item.url)

  const itemForms = rawItemRoutes.flatMap((ir) => (typeof ir === 'string' ? normalize(ir) : []))
  // Build a set of normalized allowed route tokens for faster checks
  const allowedSet = new Set<string>()
  allowedRoutes.forEach((ar) => normalize(ar).forEach((x) => allowedSet.add(x)))

  // If any normalized form of item.apiRoute exists in allowedSet, allow it
  if (itemForms.some((f) => allowedSet.has(f))) return true

  // Tolerant slug matching: compare normalized tokens (remove punctuation).
  // This handles slug differences like 'MasterApp:Center:Read' vs 'masterappcentermodeulecenterread'
  // but does NOT do substring matches to avoid false positives.
  try {
    const allowedNorm = new Set(allowedRoutes.map((ar) => normalizeToken(String(ar))))
    for (const raw of rawItemRoutes) {
      const r = normalizeToken(String(raw))
      if (!r) continue
      if (allowedNorm.has(r)) return true
    }
  } catch { }

  return false
}

/**
 * Recursively filters sidebar items.
 * A parent (submenu) is visible if at least one child passes the filter.
 */
function filterItems(items: any[], allowedRoutes: string[] | null): any[] {
  return items.reduce<any[]>((acc, item) => {
    if (item.heading) {
      acc.push(item)
      return acc
    }
    if (item.children?.length) {
      const filteredChildren = filterItems(item.children, allowedRoutes)
      if (filteredChildren.length > 0) {
        acc.push({ ...item, children: filteredChildren })
      }
      return acc
    }
    if (isItemAllowed(item, allowedRoutes)) {
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

    // Heading
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

    // Submenu
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

    // Regular menu item
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

const SidebarLayout = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname()
  const { theme } = useTheme()
  const allowedRoutes = usePermissions()

  // Only allow "light" or "dark" for AMSidebar
  const sidebarMode = theme === 'light' || theme === 'dark' ? theme : undefined

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
          {/* <FullLogo /> */}
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
        <div className='px-6'>
          {SidebarContent.map((section, index) => {
            // Filter the section's children by permissions
            const filteredChildren = filterItems(section.children || [], allowedRoutes)
            // Skip entire section if no children are visible
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
      </SimpleBar>
    </AMSidebar>
  )
}

export default SidebarLayout
