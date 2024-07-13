import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfileArea({ botList }: { botList: any[] }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState(0)
  return (
    botList.length &&
    <div className="border-[0.5rem] border-transparent flex flex-wrap">
      {botList.map((item) => (
        <div
          key={item.id}
          className="w-1/2 aspect-[3/4] border-[0.5rem] border-transparent relative"
        >
          <Image
            onMouseEnter={() => setActiveId(item.id)}
            onMouseOut={() => setActiveId(0)}
            onClick={() => { router.push(`/chat?botId=${item.id}`) }}
            className="rounded-[0.5rem] object-cover"
            layout="fill"
            objectFit='cover'
            objectPosition='top'
            src={activeId === item.id ? item.image2 : item.image1}
            alt={'avatar'}
          />
          <div className="absolute bottom-0 w-full p-2 text-white space-y-1">
            <div className="text-base font-bold">{item.name}</div>
            <div className="text-xs">{item.age}</div>
            <div className="text-xs">
              {item.description.slice(0, 40)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



