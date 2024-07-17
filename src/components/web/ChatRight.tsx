import { useState } from 'react'

const info1 = [
  { name: 'personality', img: 'personality' },
  { name: 'occupation', img: 'occupation' },
  { name: 'hobbies', img: 'label' },
  { name: 'relationship', img: 'relationship' },
]
const info2 = [
  { name: 'body', img: 'body' },
  { name: 'age', img: 'age' },
  { name: 'ethnicity', img: 'ethnicity' },
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
        <div
          className="w-6 h-6 bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: `url(/assets/attributes/${img}.png)` }}
        ></div>
        <span className="ml-1 text-xs text-[rgba(0,0,0,0.64)]">
          {name.toUpperCase()}
        </span>
      </div>
      <div className="ml-7">{value}</div>
    </>
  )
}

export default function ChatRight({ fold, activeBot }: { fold: boolean, activeBot: Record<string, any> }) {
  const [index, setIndex] = useState(0)
  return (
    <div
      className={`flex-1 max-w-[340px] min-w-[270px] h-full overflow-y-scroll ${fold ? 'hidden' : 'block'}`}
    >
      <div className="w-full aspect-[3/5] relative bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${(index == 0 ? activeBot.image1 : activeBot.image2)})` }}>
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
        <div className="text-2xl font-bold">{activeBot.name}</div>
        <div className="text-base">
          {activeBot.description}
        </div>
        <div className="pt-4 border-t border-[rgba(0,0,0,0,0.16)]">
          <div className="font-base text-[rgba(0,0,0,0,0.64)]">
            Personality Attributes
          </div>
          <div className="w-full flex flex-wrap">
            {info1.map((item) => (
              <div className="w-1/2 mt-4" key={item.name}>
                <Item img={item.img} name={item.name} value={activeBot[item.name]}></Item>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-[rgba(0,0,0,0,0.16)]">
          <div className="font-base text-[rgba(0,0,0,0,0.64)]">
            Physical Attributes
          </div>
          <div className="w-full flex flex-wrap">
            {info2.map((item) => (
              <div className="w-1/2 mt-4" key={item.name}>
                <Item img={item.img} name={item.name} value={activeBot[item.name]}></Item>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
