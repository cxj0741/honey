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
    <div className="z-50 mt-20 toast toast-center toast-top">
      <div className='alert alert-error text-white font-semibold'>
        <div>no bot selected!</div>
        <div>please select at least one bot!</div>
      </div>
    </div>
  )
}