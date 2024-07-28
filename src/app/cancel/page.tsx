'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Cancel() {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.replace('/premium')
    }, 5000)
  })

  return (
    <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
      <div className="w-80 h-32 rounded-lg bg-white flex items-center justify-center text-lg font-semibold text-center">
        <div>order cancel!</div>
        <div>navigate to home page after 5 seconds!</div>
      </div>
    </div >
  )
}
