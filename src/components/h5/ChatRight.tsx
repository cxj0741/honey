import Image from 'next/image'
import { CHAT_PART } from '@/components/h5-pages/Chat'
import { useState } from 'react'

const info1 = [
  { name: 'personality', img: 'personality', value: 'Kawai and Extrovert' },
  { name: 'occupation', img: 'occupation', value: 'Kpop Singer' },
  { name: 'label', img: 'label', value: 'working women' },
  { name: 'relationship', img: 'relationship', value: 'humorous' },
]
const info2 = [
  { name: 'body', img: 'body', value: 'Kawai and Extrovert' },
  { name: 'age', img: 'age', value: 'Kpop Singer' },
  { name: 'ethnicity', img: 'ethnicity', value: 'working women' },
]
function Item({
  img,
  name,
  value,
}: {
  img: string,
  name: string,
  value: string,
}) {
  return (
    <>
      <div className="flex items-center">
        <Image
          width={24}
          height={24}
          src={`/assets/attributes/${img}.png`}
          alt={'avatar'}
        />
        <span className="ml-1 text-xs text-[rgba(0,0,0,0.64)]">
          {name.toUpperCase()}
        </span>
      </div>
      <div className="ml-7">{value}</div>
    </>
  )
}

export default function ChatRight({ setPart, activeBot }: { setPart: Function, activeBot: Record<string, any> }) {
  const [index, setIndex] = useState(0)
  return (
    <div
      className="w-[100vw] overflow-auto no-scrollbar bg-white -mb-14"
    >
      <div className="w-full aspect-[3/4] relative bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${(index == 0 ? activeBot.image1 : activeBot.image2)})` }}>
        <div
          onClick={() => setPart(CHAT_PART.MIDDLE)}
          className="absolute left-4 top-3 w-16 h-10 bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: "url(/assets/back.png)" }}
        >
        </div>
        <div
          className="absolute w-full px-4 flex justify-between"
          style={{ top: '50%', transform: 'translateY(-50)' }}
        >
          <div
            onClick={() => setIndex(Math.abs((index - 1) % 2))}
            className="w-8 h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
            style={{ backgroundImage: "url(/assets/attributes/arrowLeft.png)" }}
          ></div>
          <div
            onClick={() => setIndex(Math.abs((index + 1) % 2))}
            className="w-8 h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
            style={{ backgroundImage: "url(/assets/attributes/arrowRight.png)" }}
          ></div>
        </div>
      </div>
      <div className="text-black p-4 space-y-4">
        <div className="text-2xl font-semibold">{activeBot.name}</div>
        <div className="text-sm">
          {activeBot.description}
        </div>
        <div className="pt-4 border-t border-[rgba(0,0,0,0.16)]">
          <div className="font-sm font-medium text-[rgba(0,0,0,0.64)]">
            Personality Attributes
          </div>
          <div className="w-full flex flex-wrap">
            {info1.map((item) => (
              <div className="w-1/2 mt-4" key={item.name}>
                <Item img={item.img} name={item.name} value={item.value}></Item>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-[rgba(0,0,0,0.16)]">
          <div className="font-sm font-medium text-[rgba(0,0,0,0.64)]">
            Physical Attributes
          </div>
          <div className="w-full flex flex-wrap">
            {info2.map((item) => (
              <div className="w-1/2 mt-4" key={item.name}>
                <Item img={item.img} name={item.name} value={item.value}></Item>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
