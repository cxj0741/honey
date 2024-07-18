import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// const [botList, setbotList] = useState([])
export default function ProfileArea({ girlList, guyList }: { girlList: any[], guyList: any[] }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState(0)
  girlList = [...girlList, ...girlList]
  guyList = [...guyList, ...guyList]
  
  return (
    girlList.length &&
    <>
      <div id='girls'>
        <div className="ml-4 my-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/female.png)' }}></div>
          <div className="text-black font-semibold">Grils</div>
        </div>
        <div className="flex flex-wrap">
          {girlList.map((item, index) => (
            <div
              key={item.id + index}
              className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 border-transparent"
            >
              <div className="w-full aspect-[3/4] rounded-lg relative">
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
                <div onClick={() => { router.push(`/chat?botId=${item.id}`) }} className="absolute right-4 top-4 w-10 h-10 rounded-full bg-[#F53276] flex items-center justify-center hover:cursor-pointer">
                  <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/girlMessage.png)' }}></div>
                </div>
                <div className="absolute bottom-0 w-full px-4 pt-2 pb-4 rounded-b-lg bg-white text-black">
                  <div className="absolute left-4 -top-6 w-16 h-16 bg-white p-1 rounded-full" style={{ background: 'linear-gradient( 180deg, #FFB5CF 0%, #FFFFFF 34%, #FFFFFF 100%)' }}>
                    <div className="w-full h-full rounded-full bg-top bg-no-repeat bg-cover" style={{ backgroundImage: `url(${item.image1})` }}></div>
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
      </div>

      <div id='guys'>
        <div className="ml-4 my-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/male.png)' }}></div>
          <div className="text-black font-semibold">Guys</div>
        </div>
        <div className="flex flex-wrap">
          {guyList.map((item) => (
            <div
              key={item.id}
              className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 border-transparent"
            >
              <div className="w-full aspect-[3/4] rounded-lg relative">
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
                <div onClick={() => { router.push(`/chat?botId=${item.id}`) }} className="absolute right-4 top-4 w-10 h-10 rounded-full bg-[#3D7CF2] flex items-center justify-center hover:cursor-pointer">
                  <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/guyMessage.png)' }}></div>
                </div>
                <div className="absolute bottom-0 w-full px-4 pt-2 pb-4 rounded-b-lg bg-white text-black">
                  <div className="absolute left-4 -top-6 w-16 h-16 bg-white p-1 rounded-full" style={{ background: 'linear-gradient( 180deg, #78A3F6 0%, #FFFFFF 34%, #FFFFFF 100%)' }}>
                    <div className="w-full h-full rounded-full bg-top bg-no-repeat bg-cover" style={{ backgroundImage: `url(${item.image1})` }}></div>
                  </div>
                  <div className="ml-[72px] flex items-baseline space-x-2">
                    <div className="max-w-[150px] text-base lg:text-xl xl:text-2xl font-semibold">{item.name}</div>
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
      </div>
    </>
  )
}