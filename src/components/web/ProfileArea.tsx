import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileArea({ botList }: { botList: any[] }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState(0)

  return (
    botList.length &&
    // <div className="border-8 border-transparent flex flex-wrap">
    <div className="flex flex-wrap">
      {botList.map((item) => (
        <div
          key={item.id}
          className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-[3/4] border-8 border-transparent relative"
        >
          {/* <div className="w-full h-full"> */}
          <Image
            onMouseEnter={() => setActiveId(item.id)}
            onMouseOut={() => setActiveId(0)}
            onClick={() => { router.push(`/chat?botId=${item.id}`) }}
            className="rounded-lg object-cover hover:cursor-pointer"
            layout="fill"
            objectFit="cover"
            objectPosition='top'
            src={activeId === item.id ? item.image2 : item.image1}
            alt={'avatar'}
          />
          {/* </div> */}
          <div className="absolute bottom-0 w-full p-2 text-white">
            <div className="text-xl font-semibold">{item.name}</div>
            <div className="mt-2 text-xs">{item.age}</div>
            <div className="mt-2 text-sm">
              {item.description.slice(0, 80)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}