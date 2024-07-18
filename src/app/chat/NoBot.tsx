'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NoBot() {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, [router])

  return (
    <div className="z-50 toast toast-center toast-top">
      <div className={`alert alert-error`}>
        <span className='text-white font-semibold'>no bot selected,&nbsp; please select at least one bot!</span>
      </div>
    </div>
  )
}