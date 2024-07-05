'use client'
import Image from 'next/image'
import ProfileArea from '@/components/web/ProfileArea'
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
      <div className="grow">
        <div className="pt-3 w-full flex justify-end">
          <div className="h-16 flex items-center" style={{ width: '90%' }}>
            <div
              onClick={() => { handler(TYPE.FEMALE) }}
              className="text-base text-white flex flex-col items-center">
              <div className="font-bold hover:text-pink-500 hover:cursor-pointer">Girls</div>
              <Image width={24} height={24} src="/assets/arc.png" alt={'arc'} />
            </div>
            <div
              onClick={() => { handler(TYPE.MALE) }}
              className="ml-4 lg:ml-8 text-base text-white flex flex-col items-center">
              <div className="font-bold hover:text-pink-500 hover:cursor-pointer">Guys</div>
              <Image width={24} height={24} src="/assets/arc.png" alt={'arc'} />
            </div>
            <div className="ml-8 lg:ml-16 text-base text-white">
              Here for your heart, your virtual companions await.
              #ConnectWithHeart #VirtualFriends
            </div>
          </div>
        </div>

        <div
          className="flex justify-center overflow-auto"
          style={{ maxHeight: 'calc(100vh - 76px)' }}
        >
          <div className="w-full max-w-[1400px]">
            <ProfileArea botList={botList} />
          </div>
        </div>
      </div>
    </>
  )
}
