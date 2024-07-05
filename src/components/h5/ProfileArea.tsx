import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfileArea({ botList }: { botList: any[] }) {
  const router = useRouter()
  // if (botList.length) {
  //   botList = new Array(30).fill({ ...botList[0], active: false })
  // }
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
            onClick={() => { router.push(`/chat/${item.id}`) }}
            className="rounded-[0.5rem] object-cover"
            layout="fill"
            objectFit='cover'
            src={activeId === item.id ? item.image2 : item.image1}
            alt={'avatar'}
          />
          <div className="absolute bottom-0 w-full p-2 text-white space-y-1">
            <div className="text-base font-bold">NAME</div>
            <div className="text-xs">AGE</div>
            <div className="text-xs">
              {item.description.slice(0, 80)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



