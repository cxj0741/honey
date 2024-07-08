import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { sendMessage } from '@/request/handleStream'
import { getDialogs, saveDialog } from '@/request'

interface Props {
  fold: boolean
  setFold: Function
  activeId: string
  userBotArray: Record<string, any>
}

function formatUnixTimestamp(unixTimestamp: number) {
  const dateObj = new Date(unixTimestamp); // 使用毫秒级 Unix 时间戳创建 Date 对象
  const hours = dateObj.getHours().toString().padStart(2, '0'); // 获取小时并补零
  const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // 获取分钟并补零
  return `${hours}:${minutes}`;
}

export default function ChatMiddle({ fold, setFold, activeId, userBotArray }: Props) {
  const [bot] = userBotArray.filter(item => item.id === activeId)
  const [chatArray, setChatArray] = useState([] as ({
    timestamp: number,
    dialog: { userStr: string, botStr: string }
  })[])

  const [result, setResult] = useState({
    timestamp: 0,
    dialog: { userStr: '', botStr: '' }
  })
  const changeArray = async () => {
    const res = await getDialogs(activeId)
    // console.log('getDialogs>>>>>>>>>>', res)
    setChatArray(res)
  }

  useEffect(() => {
    changeArray()
  }, [])

  const inputRef = useRef(null)

  const handleSendMessage = async () => {
    const userStr = inputRef?.current?.value.trim() || ''
    inputRef!.current!.value = ''
    const timestamp = Date.now()
    await sendMessage(userStr, timestamp, setResult, activeId)
    setResult({
      timestamp: 0,
      dialog: { userStr: '', botStr: '' }
    })
    // setChatArray([...chatArray, result])
    changeArray()
  }

  return (
    <div className="flex-[3] bg-[#1F1D1F] relative">
      {/* CHAT CONTENT HEADER */}
      <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.16)] text-white flex items-center">
        <div className="w-12 h-12 rounded-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bot.image1})` }}>
        </div>
        <div className="ml-4 text-xl">
          {bot.name}
        </div>
        <div className="grow flex justify-end items-center space-x-4">
          <Image
            width={24}
            height={24}
            src="/assets/refresh.png"
            alt="avatar"
          />
          <Image
            onClick={() => setFold(!fold)}
            width={24}
            height={24}
            src="/assets/arrowOut.png"
            alt="avatar"
          />
        </div>
      </div>
      {/* CHAT CONTENT DIALOG AREA */}
      <div
        className="px-6 py-4 pb-20 overflow-auto"
        style={{ height: 'calc(100% - 80px)' }}
      >
        {/* 一组对话的结构 */}
        {
          chatArray.map(item => (
            <div key={item.timestamp} className='w-full'>
              <div className="flex justify-end text-white">
                <div className="max-w-[450px] space-y-2">
                  <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg">
                    {item.dialog.userStr}
                  </div>
                  <div className="text-xs text-right">{formatUnixTimestamp(item.timestamp)}</div>
                </div>
              </div>
              <div className="flex justify-start text-white bg-transparent">
                <div className="max-w-[450px] space-y-2">
                  <div className="bg-[#F36C9C] px-3 py-2 rounded-lg">
                    {item.dialog.botStr}
                  </div>
                  {/* <div className="text-xs text-left">10:36</div> */}
                </div>
              </div>
            </div>
          ))
        }

        {result.dialog.userStr && (<div className="flex justify-end text-white">
          <div className="max-w-[450px] space-y-2">
            <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg">
              {result.dialog.userStr}
            </div>
            <div className="text-xs text-right">{formatUnixTimestamp(result.timestamp)}</div>
          </div>
        </div>)}

        {result.dialog.botStr && (<div className="flex justify-start text-white bg-transparent">
          <div className="max-w-[450px] space-y-2">
            <div className="bg-[#F36C9C] px-3 py-2 rounded-lg">
              {result.dialog.botStr}
            </div>
            {/* <div className="text-xs text-left">10:36</div> */}
          </div>
        </div>)}


        {/* 照片的结构 */}
        {/* <div className="flex justify-start text-white bg-transparent">
          <div className="max-w-[450px] space-y-2">
            <div className="w-full aspect-[3/4] rounded-3xl border-8 border-[#F36C9C] relative">
              <Image
                className="rounded-2xl object-cover"
                layout="fill"
                objectFit='cover'
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                alt="avatar"
              />
            </div>
            <div className="text-xs text-left">10:36</div>
          </div>
        </div> */}

      </div>
      {/* CHAT CONTENT SEND MESSAGE INPUT */}
      <div className="absolute -bottom-[0.5px] w-full px-6 pb-4 bg-[#1F1D1F] flex items-center space-x-2">
        {/* 这里可以使用textarea设置换行 */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message"
          className="grow input input-bordered whitespace-normal break-words text-wrap"
        />
        <div className="w-[82px] h-12 rounded-lg bg-[rgba(255,255,255,0.16)] flex items-center justify-center hover:cursor-pointer">
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
          onClick={() => handleSendMessage()}
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
