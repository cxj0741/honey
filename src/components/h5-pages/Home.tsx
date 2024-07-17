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
      <div className="mt-2 w-[100vw] h-12 px-4 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-around">
        <div
          onClick={() => { handler(TYPE.FEMALE) }}
          className="text-base text-white flex flex-col items-center relative">
          <div className="flex items-center hover:cursor-pointer">
            <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/female.png)' }}></div>
            <div className={`font-bold hover:text-[#FE387F] ${type === TYPE.FEMALE ? 'text-[#FE387F]' : 'text-[rgba(0,0,0,0.56)]'}`}>Girls</div>
          </div>
          <div className={`absolute left-0 -bottom-2 w-full h-[2px] rounded ${type === TYPE.FEMALE ? 'bg-[#FE387F]' : 'bg-transparent'}`}></div>
        </div>
        <div
          onClick={() => { handler(TYPE.MALE) }}
          className="text-base text-white flex flex-col items-center relative">
          <div className="flex items-center hover:cursor-pointer">
            <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/male.png)' }}></div>
            <div className={`font-bold hover:text-[#FE387F] ${type === TYPE.MALE ? 'text-[#FE387F]' : 'text-[rgba(0,0,0,0.56)]'}`}>Guys</div>
          </div>
          <div className={`absolute left-0 -bottom-2 w-full h-[2px] rounded ${type === TYPE.MALE ? 'bg-[#FE387F]' : 'bg-transparent'}`}></div>
        </div>
      </div>
      <ProfileArea botList={botList} />
    </>
  )
}
