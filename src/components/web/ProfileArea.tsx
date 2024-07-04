import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileArea({ botList }: { botList: any[] }) {
  const router = useRouter()
  if (botList.length) {
    botList = new Array(30).fill({ ...botList[0], active: false })
  }
  const [activeId, setActiveId] = useState(0)
  
  return (
    botList.length &&
    <div className="border-8 border-transparent flex flex-wrap">
      {botList.map((item, index) => (
        <div
          key={item.id + '' + index}
          className="w-1/2 md:w-1/3 lg:w-1/4 aspect-[3/4] border-8 border-transparent relative"
        >
          <Image
            onMouseEnter={() => setActiveId(item.id)}
            onMouseOut={() => setActiveId(0)}
            onClick={() => { router.push(`/chat/${item.id}`) }}
            className="rounded-lg object-cover"
            layout="fill"
            objectFit="cover"
            src={activeId === item.id ? item.image2 : item.image1}
            alt={'avatar'}
          />
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