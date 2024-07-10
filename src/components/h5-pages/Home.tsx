'use client'
import ProfileArea from '@/components/h5/ProfileArea'
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
      <div className="w-[100vw] h-10 mt-2 px-4 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div
            onClick={() => { handler(TYPE.FEMALE) }}
            className="text-base text-white flex flex-col items-center relative">
            <div className={`font-bold hover:text-pink-500 hover:cursor-pointer ${type === TYPE.FEMALE ? 'text-pink-500' : 'text-white'}`}>Girls</div>
            <div className={`absolute left-0 -bottom-2 w-full h-1 rounded ${type === TYPE.FEMALE ? 'bg-pink-500' : 'bg-transparent'}`}></div>
          </div>
          <div
            onClick={() => { handler(TYPE.MALE) }}
            className="text-base text-white flex flex-col items-center relative">
            <div className={`font-bold hover:text-pink-500 hover:cursor-pointer ${type === TYPE.MALE ? 'text-pink-500' : 'text-white'}`}>Guys</div>
            <div className={`absolute left-0 -bottom-2 w-full h-1 rounded ${type === TYPE.MALE ? 'bg-pink-500' : 'bg-transparent'}`}></div>
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
