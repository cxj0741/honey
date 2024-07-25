import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TYPE } from '@/request'

export default function ProfileArea({ botList, type }: { botList: any[], type: string }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState(0)

  useEffect(() => {
    const carouselContainer = document.querySelector('.carousel');
    carouselContainer!.scrollLeft = 0;
  }, [botList])
  return (
    <div className="carousel carousel-center space-x-4 p-4 w-full"
      style={{ height: 'calc(100vh - 10rem)' }}
    >
      {botList.map((item) => (
        <div
          key={item.id}
          className='carousel-item w-[95%]'
        >
          <div key={item.id} className="w-full rounded-lg relative"
            style={{ height: 'calc(100vh - 12rem)' }}
          >
            <Image
              onMouseEnter={() => setActiveId(item.id)}
              onMouseOut={() => setActiveId(0)}
              onClick={() => { router.push(`/chat?botId=${item.id}`) }}
              className="rounded-lg hover:cursor-pointer"
              layout="fill"
              objectFit="cover"
              objectPosition='top'
              src={activeId === item.id ? item.image2 : item.image1}
              alt={'avatar'}
            />
            <div onClick={() => { router.push(`/chat?botId=${item.id}`) }} className={`absolute right-4 top-4 w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer ${type === TYPE.FEMALE && ' bg-[#F53276]'} ${type === TYPE.MALE && ' bg-[#3D7CF2]'}`}>
              {type === TYPE.FEMALE && <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/girlMessage.png)' }}></div>}
              {type === TYPE.MALE && <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/guyMessage.png)' }}></div>}
            </div>
            <div className="absolute bottom-0 w-full px-4 pt-2 pb-4 rounded-b-lg bg-white text-black">
              <div className="absolute left-4 -top-6 w-16 h-16 bg-white p-1 rounded-full" style={{ background: type === TYPE.FEMALE ? 'linear-gradient( 180deg, #FFB5CF 0%, #FFFFFF 34%, #FFFFFF 100%)' : 'linear-gradient( 180deg, #78A3F6 0%, #FFFFFF 34%, #FFFFFF 100%)' }}>
                <div className="w-full h-full rounded-full bg-top bg-no-repeat bg-cover" style={{ backgroundImage: `url(${item.image1})` }}></div>
              </div>
              <div className="ml-[72px] flex items-baseline space-x-2">
                <div className="max-w-[10rem] text-base lg:text-xl xl:text-xl font-semibold single-line-ellipsis">{item.name}</div>
                <div className="text-xs text-[rgba(0,0,0,0.64)]">{item.age} years</div>
              </div>
              <div className="mt-2 text-sm">
                {item.description.slice(0, 60)}...
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

