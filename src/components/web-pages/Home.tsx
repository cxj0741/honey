'use client'
import Image from 'next/image'
import ProfileArea from '@/components/web/ProfileArea'
import { useCallback, useEffect, useState } from 'react'
import { TYPE, getBots } from '@/request'
export default function Home() {
  // const [type, setType] = useState(TYPE.FEMALE)
  const [girlList, setGirlList] = useState([])
  const [guyList, setGuyList] = useState([])
  const handler = useCallback(async (type: string) => {
    // setType(type)
    const list = await getBots(type)
    if (type === TYPE.FEMALE) {
      setGirlList(list)
    }
    if (type === TYPE.MALE) {
      setGuyList(list)
    }
  }, [])

  useEffect(() => {
    handler(TYPE.FEMALE)
    handler(TYPE.MALE)
  }, [handler])

  const scrollTo = useCallback((anchor: string) => {
    (document.getElementById('girls') as any).scrollIntoView({
      behavior: 'smooth', // 使用平滑滚动
      block: 'start' // 将元素的顶部对齐到视窗的顶部
    })
  }, [])

  return (
    <>
      <div className="px-2 flex-1 bg-[#F4F4F5] max-h-[100vh] overflow-scroll">
        <div className="ml-4 my-6">
          <div className="font-semibold text-[#FE387F]">Hi,honeybun</div>
          <div className="mt-1 flex items-center">
            <div className="font-semibold text-[#FE387F]">Welcome back</div>
            <div
              onClick={() => scrollTo('girls')}
              className="ml-10 text-base text-black font-semibold hover:text-[#FE387F] hover:cursor-pointer">
              Girls
            </div>
            <div onClick={() => scrollTo('guys')}
              className="ml-8 text-base text-black font-semibold hover:text-[#FE387F] hover:cursor-pointer">
              Guys
            </div>
          </div>
        </div>
        <div
          className="flex justify-center"
        // style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          <div className="w-full">
            <div className="px-2 w-full max-sm:hidden">
              <div className="carousel w-full aspect-[1672/326]">
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
            <ProfileArea girlList={girlList} guyList={guyList} />
          </div>
        </div>
      </div>
    </>
  )
}
