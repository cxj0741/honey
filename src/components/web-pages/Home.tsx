'use client'
// import Image from 'next/image'
import ProfileArea from '@/components/web/ProfileArea'
import { useEffect, useState } from 'react'
import { TYPE, getBots } from '@/request'

export default function Home() {
  const [type, setType] = useState(TYPE.FEMALE)
  const [botList, setbotList] = useState([])
  const handler = async (type: string) => {
    setType(type)
    const list = await getBots(type)
    setbotList(list)
  }
  useEffect(() => {
    handler(TYPE.FEMALE)
  }, [])

  return (
    <>
      <div className="flex-1">
        <div className="pt-3 border-b border-[#363636] w-full flex justify-end">
          <div className="h-16  flex items-center" style={{ width: '90%' }}>
            <div
              onClick={() => { handler(TYPE.FEMALE) }}
              className="text-base text-white flex flex-col items-center relative">
              <div className={`font-bold hover:text-pink-500 hover:cursor-pointer ${type === TYPE.FEMALE ? 'text-pink-500' : 'text-white'}`}>Girls</div>
              {/* <Image width={24} height={24} src="/assets/arc.png" alt={'arc'} /> */}
              <div className={`absolute left-0 -bottom-5 w-full h-1 rounded ${type === TYPE.FEMALE ? 'bg-pink-500' : 'bg-transparent'}`}></div>
            </div>
            <div
              onClick={() => { handler(TYPE.MALE) }}
              className="ml-4 lg:ml-8 text-base text-white flex flex-col items-center relative">
              <div className={`font-bold hover:text-pink-500 hover:cursor-pointer ${type === TYPE.MALE ? 'text-pink-500' : 'text-white'}`}>Guys</div>
              {/* <Image width={24} height={24} src="/assets/arc.png" alt={'arc'} /> */}
              <div className={`absolute left-0 -bottom-5 w-full h-1 rounded ${type === TYPE.MALE ? 'bg-pink-500' : 'bg-transparent'}`}></div>
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
