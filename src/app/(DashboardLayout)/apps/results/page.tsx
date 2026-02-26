import ResultsApp from '@/app/components/apps/results/ResultsApp'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Result Management' }

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Results' },
]


export default function ResultsPage() {
  return (
    <>
      <BreadcrumbComp title='Result Management' items={BCrumb} />
      <ResultsApp />
    </>
  )
}
