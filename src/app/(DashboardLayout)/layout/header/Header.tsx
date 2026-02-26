'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react'
import Profile from './Profile'
import Notifications from './Notifications'
import SidebarLayout from '../sidebar/Sidebar'
import FullLogo from '../shared/logo/FullLogo'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Header = () => {
  const { setTheme } = useTheme()
  const [isSticky, setIsSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Force light theme permanently
  useEffect(() => {
    setTheme('light')
  }, [setTheme])

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 xl:top-[4px] z-2 ${isSticky ? 'bg-background shadow-md fixed w-full' : 'bg-transparent'}`}>
        <nav className={`rounded-none py-4 sm:ps-6 max-w-full! sm:pe-10 flex justify-between items-center px-6`}>

          {/* Mobile menu toggle */}
          <div
            onClick={() => setIsOpen(true)}
            className='px-3.5 hover:text-primary text-link relative after:absolute after:w-10 after:h-10 after:rounded-full hover:after:bg-lightprimary after:bg-transparent rounded-full xl:hidden flex justify-center items-center cursor-pointer'>
            <Icon icon='tabler:menu-2' height={20} width={20} />
          </div>

          <div className='block xl:hidden'>
            <FullLogo />
          </div>

          {/* Mobile right side */}
          <div className='flex xl:hidden items-center gap-1'>
            <Notifications />
            <Profile />
          </div>

          {/* Desktop nav */}
          <div className='hidden xl:flex items-center justify-between w-full'>
            {/* Search */}
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Icon
                  icon='solar:magnifer-linear'
                  width={18}
                  height={18}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-bodytext'
                />
                <Input
                  type='text'
                  placeholder='Search...'
                  className='rounded-xl pl-10 bg-muted border-defaultBorder focus:border-primary'
                />
              </div>
            </div>

            {/* Right icons */}
            <div className='flex items-center gap-1'>
              <Notifications />
              <Profile />
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side='left' className='w-64 p-0'>
          <VisuallyHidden>
            <SheetTitle>sidebar</SheetTitle>
          </VisuallyHidden>
          <SidebarLayout onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Header
