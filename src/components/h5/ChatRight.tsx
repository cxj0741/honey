import Image from 'next/image'
import { CHAT_PART } from '@/components/h5-pages/Chat'

const info1 = [
  { name: 'personality', img: 'personality', value: 'Kawai and Extrovert' },
  { name: 'occupation', img: 'occupation', value: 'Kpop Singer' },
  { name: 'label', img: 'label', value: 'working women' },
  { name: 'chat style', img: 'chatStyle', value: 'humorous' },
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
        <span className="ml-1 text-xs text-[rgba(255,255,255,0.64)]">
          {name.toUpperCase()}
        </span>
      </div>
      <div className="ml-7">{value}</div>
    </>
  )
}

export default function ChatRight({ setPart }: { setPart: Function }) {
  return (
    <div
      className="w-[100vw] overflow-auto bg-[#1F1D1F]"
    >
      <div className="w-full aspect-[3/4] relative">
        <Image
          className='object-cover'
          layout="fill"
          objectFit='cover'
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          alt="avatar"
        />
        <div
          onClick={() => setPart(CHAT_PART.MIDDLE)}
          className="absolute left-4 top-3 px-2 rounded-lg flex items-center space-x-1 bg-[rgba(255,255,255,0.32)]"
        >
          <Image
            width={14}
            height={14}
            src="/assets/attributes/arrowLeft.png"
            alt={'arc'}
          />
          <div className="text-white text-sm">Back</div>
        </div>
        <div
          className="absolute w-full px-4 flex justify-between"
          style={{ top: '50%', transform: 'translateY(-50)' }}
        >
          <Image
            width={32}
            height={32}
            src="/assets/attributes/arrowLeft.png"
            alt={'arc'}
          />
          <Image
            width={32}
            height={32}
            src="/assets/attributes/arrowRight.png"
            alt={'arc'}
          />
        </div>
      </div>
      <div className="text-white p-4 space-y-4">
        <div className="text-2xl font-semibold">NAME</div>
        <div className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium
          reprehenderit voluptatum quo sit cum commodi iusto soluta adipisci
          sunt iste quia, qui ipsa quod. Commodi qui dicta quasi repellendus
          vero?
        </div>
        <div className="pt-4 border-t border-[rgba(255,255,255,0.16)]">
          <div className="font-sm font-medium text-[rgba(255,255,255,0.64)]">
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
        <div className="pt-4 border-t border-[rgba(255,255,255,0.16)]">
          <div className="font-sm font-medium text-[rgba(255,255,255,0.64)]">
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
