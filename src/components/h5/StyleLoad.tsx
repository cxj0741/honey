
'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { emitter, FOOTER_NAV_EVENT, resizeRem } from '@/utils'

export default function StyleLoad() {
  useEffect(resizeRem)

  const pathname = usePathname()
  useEffect(() => {
    console.log('pathname change>>>>>>', pathname)
    emitter.emit(FOOTER_NAV_EVENT, true)
  }, [pathname])
  
  return (
    <div className="fixed left-0 top-0" style={{ transform: 'translateX(-100vw)' }}></div>
  )
}
