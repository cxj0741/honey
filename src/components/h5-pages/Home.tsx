'use client'
import Image from 'next/image'
import ProfileArea from '@/components/h5/ProfileArea'
import { useEffect, useState } from 'react'
import { TYPE, getBots } from '@/request'

export default function Home() {
  const [botList, setbotList] = useState([])

  const handler = async (type: string) => {
    const list = await getBots(type)
    setbotList(list)
  }

  useEffect(() => {
    handler(TYPE.FEMALE)
  }, [])

  return (
    <>
      <div className="w-[100vw] h-10 mt-2 px-4 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div
            onClick={() => { handler(TYPE.FEMALE) }}
            className="text-base text-white flex flex-col items-center">
            <div className="font-bold hover:text-pink-500">Girls</div>
            <Image width={24} height={24} src="/assets/arc.png" alt={'arc'} />
          </div>
          <div
            onClick={() => { handler(TYPE.MALE) }}
            className="text-base text-white flex flex-col items-center">
            <div className="font-bold hover:text-pink-500">Guys</div>
            <Image width={24} height={24} src="/assets/arc.png" alt={'arc'} />
          </div>
        </div>
        <div className="w-[12rem] text-xs text-white">
          Here for your heart, your virtual companions await...
        </div>
      </div>
      <ProfileArea botList={botList} />
    </>
  )
}
