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
  apiRoute?: string
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
  apiRoute?: string
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
        isPro: false
      },
      // Removed extra dashboards and front pages — replaced by Statistics section below
    ],
  },

  {
    heading: 'Fees & Accounts',
    children: [
      { id: uniqueId(), name: 'Fees & Accounts', icon: 'solar:coins-line', url: '/masters/fees', isPro: false, apiRoute: 'GET /fees' },
      { id: uniqueId(), name: 'Pending Fees', icon: 'solar:clock-line', url: '/masters/fees/pending', isPro: false, apiRoute: 'GET /fees/pending' },
      { id: uniqueId(), name: 'Center Collection', icon: 'solar:bank-line', url: '/masters/fees/centers', isPro: false, apiRoute: 'GET /fees/center' },
    ],
  },


  {
    heading: 'Statistics',
    children: [
      { id: uniqueId(), name: 'Total Centers', icon: 'solar:chart-line-duotone', url: '/apps/centers', disabled: false, apiRoute: ['GET /centers','/centers','MasterApp:CenterModule:Center-List'] },
      { id: uniqueId(), name: 'Total Students', icon: 'solar:chart-line-duotone', url: '/apps/students', disabled: false, apiRoute: 'GET /students' },
      { id: uniqueId(), name: 'Active Courses', icon: 'solar:chart-line-duotone', url: '#', disabled: true },
      { id: uniqueId(), name: 'Monthly Admissions', icon: 'solar:chart-line-duotone', url: '#', disabled: true },
      { id: uniqueId(), name: 'Total Revenue (All Centers)', icon: 'solar:chart-line-duotone', url: '#', disabled: true },
      { id: uniqueId(), name: 'Pending Complaints', icon: 'solar:chart-line-duotone', url: '#', disabled: true },
    ],
  },
  {
    heading: 'Course Management',
    children: [

      { id: uniqueId(), name: 'Courses', icon: 'solar:book-open-line', url: '/masters/courses', isPro: false, apiRoute: 'GET /courses' },
   
    ],
  },
  {
    heading: 'Master Management',
    children: [
      { id: uniqueId(), name: 'Categories', icon: 'solar:folder-line', url: '/masters/categories', isPro: false, apiRoute: 'GET /categories' },
      { id: uniqueId(), name: 'Departments', icon: 'solar:building-line', url: '/masters/departments', isPro: false, apiRoute: 'GET /departments' },
      { id: uniqueId(), name: 'Programs (Names & Codes)', icon: 'solar:book-open-line', url: '/masters/programs', isPro: false, apiRoute: 'GET /programs' },
      { id: uniqueId(), name: 'Streams', icon: 'solar:flow-line', url: '/masters/streams', isPro: false, apiRoute: 'GET /streams' },
      { id: uniqueId(), name: 'Subjects', icon: 'solar:pencil-line', url: '/masters/subjects', isPro: false, apiRoute: 'GET /subjects' },
      { id: uniqueId(), name: 'Specializations', icon: 'solar:star-line', url: '/masters/specializations', isPro: false, apiRoute: 'GET /specializations' },
      { id: uniqueId(), name: 'Addresses', icon: 'solar:map-pin-line', url: '/masters/addresses', isPro: false, apiRoute: 'GET /addresses' },
    ],
  },
  {
    heading: 'Administration',
    children: [
      {
        name: 'Roles & Permissions',
        icon: 'solar:shield-keyhole-line-duotone',
        id: uniqueId(),
        children: [
          { id: uniqueId(), name: 'Roles', url: '/administration/roles', isPro: false, apiRoute: 'GET /roles' },
          { id: uniqueId(), name: 'Permissions', url: '/administration/permissions', isPro: false, apiRoute: 'GET /permissions' },
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
        apiRoute: 'GET /results',
      }
      
      
     
    ],
  },

 
]

export default SidebarContent
