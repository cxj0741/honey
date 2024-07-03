import Image from 'next/image'
import { CHAT_PART } from '@/components/h5-pages/Chat'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'

export default function ChatMiddle({ setPart, setDialogShow }: { setPart: Function, setDialogShow: Function }) {
  return (
    <div className="w-[100vw] bg-[#1F1D1F] relative">
      <div className="h-12 px-4 border-t border-b border-[rgba(255,255,255,0.16)] text-white flex items-center justify-between">
        <Image
          onClick={() => {
            emitter.emit(FOOTER_NAV_EVENT, true)
            setPart(CHAT_PART.LEFT)
          }}
          width={24}
          height={24}
          src="/assets/arrowIn.png"
          alt="avatar"
        />
        <div className="flex items-center">
          <Image
            className="rounded-full"
            width={32}
            height={32}
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            alt="avatar"
          />
          <div className="ml-4">NAME</div>
        </div>
        <Image
          onClick={() => {
            setPart(CHAT_PART.RIGHT)
          }}
          width={24}
          height={24}
          src="/assets/arrowOut.png"
          alt="avatar"
        />
      </div>
      <div
        className="p-4 space-y-4 pb-20 overflow-auto"
        style={{ height: 'calc(100% - 3rem)' }}
      >
        <div className="flex justify-start text-white bg-transparent">
          <div className="w-4/5 space-y-1">
            <div className="bg-[#F36C9C] px-3 py-2 rounded-lg">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
              veniam maiores repudiandae quo perferendis necessitatibus,
              molestiae magni quibusdam animi velit! Qui, excepturi. Corrupti
              quaerat ducimus, iste nulla saepe sequi modi.
            </div>
            <div className="text-xs text-left text-[rgba(255,255,255,0.64)]">10:36</div>
          </div>
        </div>

        <div className="flex justify-end text-white">
          <div className="w-4/5 space-y-1">
            <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
              veniam maiores repudiandae quo perferendis necessitatibus,
              molestiae magni quibusdam animi velit! Qui, excepturi. Corrupti
              quaerat ducimus, iste nulla saepe sequi modi.
            </div>
            <div className="text-xs text-right text-[rgba(255,255,255,0.64)]">10:36</div>
          </div>
        </div>

        <div className="flex justify-start text-white bg-transparent">
          <div className="w-4/5 space-y-2">
            <div className="w-full aspect-[3/4] rounded-3xl border-8 border-[#F36C9C] relative">
              <Image
                className="rounded-2xl object-cover"
                layout="fill"
                objectFit='cover'
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                alt="avatar"
              />
            </div>
            <div className="text-xs text-left text-[rgba(255,255,255,0.64)]">10:36</div>
          </div>
        </div>
      </div>
      {/* CHAT CONTENT SEND MESSAGE INPUT */}
      <div className="fixed bottom-0 w-[100vw] h-[4.5rem] px-4 pr-0 py-3 border-t border-[rgba(255,255,255,0.16)] bg-[#1F1D1F] flex items-center space-x-1">
        <input
          type="text"
          placeholder="Type a message"
          className="w-[14rem] input input-bordered whitespace-normal break-words text-wrap"
        />
        <div className="w-[5rem] h-12 rounded-lg bg-[rgba(255,255,255,0.16)] flex items-center justify-center hover:cursor-pointer">
          <div className="w-full px-2 dropdown dropdown-top dropdown-end">
            <div
              tabIndex={0}
              className="text-white flex items-center justify-between"
            >
              <Image
                width={16}
                height={18}
                src="/assets/ask.png"
                alt="avatar"
              />
              <span>Ask</span>
              <Image
                width={12}
                height={12}
                src="/assets/arrowDown.png"
                alt="avatar"
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              {['Show me...', 'Send me...', 'Can I see...'].map((item) => (
                <li key={item}>
                  <a>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Image
          className="hover:cursor-pointer"
          width={48}
          height={48}
          src="/assets/send.png"
          alt={'arc'}
        />
      </div>
    </div>
  )
}
