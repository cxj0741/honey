'use client'
import Image from 'next/image'
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
      <div className="mt-2 w-[100vw] h-12 px-4 border-b border-[rgba(255,255,255,0.16)] flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div
            onClick={() => { handler(TYPE.FEMALE) }}
            className="text-base text-white flex flex-col items-center relative">
            <div className={`font-bold hover:text-pink-500 hover:cursor-pointer ${type === TYPE.FEMALE ? 'text-pink-500' : 'text-white'}`}>Girls</div>
            <div className={`absolute left-0 -bottom-3 w-full h-1 rounded ${type === TYPE.FEMALE ? 'bg-pink-500' : 'bg-transparent'}`}></div>
          </div>
          <div
            onClick={() => { handler(TYPE.MALE) }}
            className="text-base text-white flex flex-col items-center relative">
            <div className={`font-bold hover:text-pink-500 hover:cursor-pointer ${type === TYPE.MALE ? 'text-pink-500' : 'text-white'}`}>Guys</div>
            <div className={`absolute left-0 -bottom-3 w-full h-1 rounded ${type === TYPE.MALE ? 'bg-pink-500' : 'bg-transparent'}`}></div>
          </div>
        </div>
        {/* <div className="w-[12rem] text-xs text-white">
          Here for your heart, your virtual companions await...
        </div> */}
      </div>
      <div className="pt-4 px-4 w-full">
        <div className="carousel w-full aspect-[4/1] rounded">
          <div id="slide1" className="carousel-item relative w-full">
            <Image
              layout="fill"
              objectFit="cover"
              alt="avatar"
              src="/assets/banner1.png"
              className="w-full" />
            {/* <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide4" className="btn btn-circle">❮</a>
              <a href="#slide2" className="btn btn-circle">❯</a>
            </div> */}
          </div>
          {/* <div id="slide2" className="carousel-item relative w-full">
            <Image
              layout="fill"
              objectFit="cover"
              alt="avatar"
              src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg"
              className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide1" className="btn btn-circle">❮</a>
              <a href="#slide3" className="btn btn-circle">❯</a>
            </div>
          </div> */}
        </div>
      </div>
      <ProfileArea botList={botList} />
    </>
  )
}
