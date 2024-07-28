'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Cancel() {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.replace('/premium')
    }, 3000)
  })

  return (
    <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
      <div className="w-[810px] h-20 rounded-lg">
        Order Cancel!Navigate To Premium after 3 seconds!
      </div>
    </div >
  )
}
