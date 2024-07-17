import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfileArea({ botList }: { botList: any[] }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState(0)
  return (
    <div className="carousel carousel-center space-x-3 p-4 w-full">
      {botList.map((item) => (
        <div
          key={item.id}
          className='carousel-item w-[95%]'
        >
          <div key={item.id} className="w-full aspect-[3/5] rounded-lg relative">
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
            <div className="absolute bottom-0 w-full px-4 pt-2 pb-4 rounded-b-lg bg-white text-black">
              <div className="absolute left-4 -top-6 w-16 h-16 bg-white p-1 rounded-full" style={{ background: 'linear-gradient( 180deg, #FFB5CF 0%, #FFFFFF 34%, #FFFFFF 100%)' }}>
                <div className="w-full h-full rounded-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${item.image1})` }}></div>
              </div>
              <div className="ml-[72px] flex items-baseline space-x-2">
                <div className="max-w-[150px] text-base lg:text-xl xl:text-xl font-semibold">{item.name}</div>
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

