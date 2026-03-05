import { uniqueId } from 'lodash'

export interface ChildItem {
  id?: number | string
  name?: string
  icon?: any
  children?: ChildItem[]
  item?: any
  url?: any
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  isPro?: boolean
  /** Backend apiRoute that grants access to this sidebar item, e.g. 'GET /students' */
  apiRoute?: string | string[]
  /** Permission slug for role-based access control */
  permission?: string
  /** Module slug identifier */
  slug?: string
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: any
  id?: number
  to?: string
  items?: MenuItem[]
  children?: ChildItem[]
  url?: any
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  isPro?: boolean
  /** Backend apiRoute that grants access to this sidebar item */
  apiRoute?: string | string[]
  /** Permission slug for role-based access control */
  permission?: string
  /** Module slug identifier */
  slug?: string
}

const SidebarContent: MenuItem[] = [
  {
    heading: 'Dashboards',
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/",
        isPro: false,
        slug: 'dashboard',
        permission: 'dashboard.view',
        apiRoute: 'GET /dashboard'
      },
    ],
  },

  {
    heading: 'Fees & Accounts',
    children: [
      { id: uniqueId(), name: 'Fees & Accounts', icon: 'solar:coins-line', url: '/masters/fees', isPro: false, slug: 'fees', permission: 'fees.view', apiRoute: 'GET /fees' },
      { id: uniqueId(), name: 'Pending Fees', icon: 'solar:clock-line', url: '/masters/fees/pending', isPro: false, slug: 'fees-pending', permission: 'fees.pending.view', apiRoute: 'GET /fees/pending' },
      { id: uniqueId(), name: 'Center Collection', icon: 'solar:bank-line', url: '/masters/fees/centers', isPro: false, slug: 'fees-center-collection', permission: 'fees.center.view', apiRoute: 'GET /fees/center' },
    ],
  },


  {
    heading: 'Statistics',
    children: [
      { id: uniqueId(), name: 'Total Centers', icon: 'solar:chart-line-duotone', url: '/apps/centers', disabled: false, slug: 'centers', permission: 'centers.view', apiRoute: ['GET /centers','/centers','MasterApp:CenterModule:Center-List','MasterApp:Center-Module:Center-List'] },
      { id: uniqueId(), name: 'Total Students', icon: 'solar:chart-line-duotone', url: '/apps/students', disabled: false, slug: 'students', permission: 'students.view', apiRoute: ['GET /students','/students','MasterApp:Student:Listing','MasterApp:Student-Module:Student-List'] },
      { id: uniqueId(), name: 'Active Courses', icon: 'solar:chart-line-duotone', url: '#', disabled: true, slug: 'active-courses', permission: 'statistics.courses.view' },
      { id: uniqueId(), name: 'Monthly Admissions', icon: 'solar:chart-line-duotone', url: '#', disabled: true, slug: 'monthly-admissions', permission: 'statistics.admissions.view' },
      { id: uniqueId(), name: 'Total Revenue (All Centers)', icon: 'solar:chart-line-duotone', url: '#', disabled: true, slug: 'total-revenue', permission: 'statistics.revenue.view' },
      { id: uniqueId(), name: 'Pending Complaints', icon: 'solar:chart-line-duotone', url: '/masters/complaints', disabled: false, slug: 'complaints', permission: 'complaints.view', apiRoute: 'GET /complaints' },
    ],
  },
  {
    heading: 'Course Management',
    children: [
      { id: uniqueId(), name: 'Courses', icon: 'solar:book-open-line', url: '/masters/courses', isPro: false, slug: 'courses', permission: 'courses.view', apiRoute: 'GET /courses' },
    ],
  },
  {
    heading: 'Master Management',
    children: [
      { id: uniqueId(), name: 'Categories', icon: 'solar:folder-line', url: '/masters/categories', isPro: false, slug: 'categories', permission: 'categories.view', apiRoute: 'GET /categories' },
      { id: uniqueId(), name: 'Departments', icon: 'solar:building-line', url: '/masters/departments', isPro: false, slug: 'departments', permission: 'departments.view', apiRoute: 'GET /departments' },
      { id: uniqueId(), name: 'Programs (Names & Codes)', icon: 'solar:book-open-line', url: '/masters/programs', isPro: false, slug: 'programs', permission: 'programs.view', apiRoute: 'GET /programs' },
      { id: uniqueId(), name: 'Streams', icon: 'solar:flow-line', url: '/masters/streams', isPro: false, slug: 'streams', permission: 'streams.view', apiRoute: 'GET /streams' },
      { id: uniqueId(), name: 'Subjects', icon: 'solar:pencil-line', url: '/masters/subjects', isPro: false, slug: 'subjects', permission: 'subjects.view', apiRoute: 'GET /subjects' },
      { id: uniqueId(), name: 'Specializations', icon: 'solar:star-line', url: '/masters/specializations', isPro: false, slug: 'specializations', permission: 'specializations.view', apiRoute: 'GET /specializations' },
      { id: uniqueId(), name: 'Addresses', icon: 'solar:map-pin-line', url: '/masters/addresses', isPro: false, slug: 'addresses', permission: 'addresses.view', apiRoute: 'GET /addresses' },
    ],
  },
  {
    heading: 'Administration',
    children: [
      {
        name: 'Roles & Permissions',
        icon: 'solar:shield-keyhole-line-duotone',
        id: uniqueId(),
        slug: 'roles-permissions',
        permission: 'administration.view',
        children: [
          { id: uniqueId(), name: 'Roles', url: '/administration/roles', isPro: false, slug: 'roles', permission: 'roles.view', apiRoute: 'GET /roles' },
          { id: uniqueId(), name: 'Permissions', url: '/administration/permissions', isPro: false, slug: 'permissions', permission: 'permissions.view', apiRoute: 'GET /permissions' },
        ],
      },
    ],
  },

  // AI section removed and replaced by Statistics section
  
  // Utilities section removed and replaced by Statistics section
  {
    heading: 'Result Management',
    children: [
      {
        id: uniqueId(),
        name: 'Results',
        icon: 'solar:document-check-line',
        url: '/apps/results',
        isPro: false,
        slug: 'results',
        permission: 'results.view',
        apiRoute: 'GET /results',
      }
    ],
  },

 
]

export default SidebarContent
