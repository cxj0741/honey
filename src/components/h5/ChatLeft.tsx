import Image from 'next/image'
import { useState } from 'react'
import { CHAT_PART } from '@/components/h5-pages/Chat'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'

export default function ChatLeft({ setPart }: { setPart: Function }) {
  const [hintShow, setHintShow] = useState(true)
  return (
    <div
      className="w-[100vw] px-4 py-2 bg-cover bg-center text-white space-y-6 flex flex-col"
      style={{ backgroundImage: 'url(../../assets/chatBg.png)', height: 'calc(100vh - 4rem)' }}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl">Chat</div>
        <label className="input input-bordered flex items-center gap-2 text-slate-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Search for a profile..."
          />
        </label>
      </div>
      <div className="grow space-y-4 overflow-auto">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            onClick={() => {
              emitter.emit(FOOTER_NAV_EVENT, false)
              setPart(CHAT_PART.MIDDLE)
            }}
            key={item}
            // className="h-16 p-2 flex items-center justify-between space-x-3 border rounded-lg border-transparent hover:border-[rgba(255,255,255,0.32)] hover:cursor-pointer group"
            className="h-12 flex items-center justify-between space-x-3"
          >
            <Image
              className="rounded-full"
              width={48}
              height={48}
              src="/assets/avatar.png"
              alt={'avatar'}
            />
            <div className="grow space-y-2">
              <div className="text-sm">NAME</div>
              <div className="w-[60vw] text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                nobis at ad optio obcaecati maxime magni odit. Ea, tenetur
                voluptatum. Sapiente, dolorem consequuntur. Sunt, aspernatur
                est quis labore quisquam eius?
              </div>
            </div>
            <div className="space-y-3 flex flex-col items-end">
              <div className="text-xs text-[rgba(255,255,255,0.64)]">
                10:36
              </div>
              <Image
                className={`${hintShow ? 'visible' : 'invisible'}`}
                width={16}
                height={16}
                src="/assets/refresh.png"
                alt={'avatar'}
              />
              {/* <div className="flex space-x-1 invisible group-hover:visible">
                <Image
                  width={16}
                  height={16}
                  src="/assets/refresh.png"
                  alt={'avatar'}
                />
                <Image
                  width={16}
                  height={16}
                  src="/assets/delete.png"
                  alt={'avatar'}
                />
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
