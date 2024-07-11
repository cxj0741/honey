import { CHAT_PART } from '@/components/h5-pages/Chat'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'
import { useEffect, useState, useRef } from 'react'
import { sendMessage } from '@/request/handleStream'
import { getDialogs, getUserInfo, saveDialog, setConversationId } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import SubscribeDialog from '@/components/h5/SubscribeDialog'
import { useSession } from 'next-auth/react'

interface Props {
  setPart: Function
  activeBot: Record<string, any>
}

export default function ChatMiddle({ setPart, activeBot }: Props) {
  const [chatArray, setChatArray] = useState([] as ({
    timestamp: number,
    dialog: { userStr: string, botStr: string, image: string }
  })[])
  const [result, setResult] = useState({
    timestamp: 0,
    dialog: { userStr: '', botStr: '', image: '' }
  })
  const chatContainer = useRef(null)
  const changeArray = async () => {
    const res = await getDialogs(activeBot.id)
    setChatArray(res)
    setTimeout(() => {
      if (chatContainer && chatContainer.current) {
        (chatContainer.current as any).scrollTop = (chatContainer.current as any).scrollHeight
      }
    }, 100)
  }
  useEffect(() => {
    changeArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBot])
  const inputRef = useRef(null)
  const [inputShow, setInputShow] = useState(true)
  const session = useSession()
  const [dialogShow, setDialogShow] = useState(false)
  const handleSendMessage = async () => {
    const userStr = (inputRef?.current as any)?.value.trim() || ''
    if (!userStr) { return }

    const { messages, tokens } = await getUserInfo()
    console.log('messages, tokens', messages, tokens)
    if (messages <= 0) {
      setDialogShow(true)
      return
    }
    if (tokens <= 0) {
      console.log('tokens', tokens)
    }

    setInputShow(false);
    (inputRef!.current as any).value = ''
    const timestamp = Date.now()

    try {
      const [botStr, image, conversationId] = await sendMessage({ user: (session.data?.user as any)?.id, userStr, conversationId: localStorage.getItem(activeBot.id) || '' }, timestamp, setResult)
      console.log('succeed send message>>>>> set', botStr, image, conversationId)
      console.log('conversationId>>>>> set', activeBot.id, conversationId)
      if (!localStorage.getItem(activeBot.id)) {
        localStorage.setItem(activeBot.id, conversationId)
        await setConversationId(activeBot.id, conversationId)
      }
      if (botStr) {
        await saveDialog({ botId: activeBot.id, timestamp, dialog: { userStr, botStr, image }, })
      }
    } catch (error) {
      console.log('fail send message>>>>>', error)
      await saveDialog({ botId: activeBot.id, timestamp, dialog: { userStr, botStr: '', image: '' } })
    }

    try {
      await changeArray()
    } catch (error) {
      setTimeout(async () => { await changeArray() }, 3000)
    }

    setResult({
      timestamp: 0,
      dialog: { userStr: '', botStr: '', image: '' }
    })
    setInputShow(true)
  }
  const handleKeyDown = (key: string) => {
    if (key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <>
      <div className="w-[100vw] bg-[#1F1D1F] relative">
        <div className="h-12 px-4 border-t border-b border-[rgba(255,255,255,0.16)] text-white flex items-center justify-between">
          <div
            onClick={() => {
              emitter.emit(FOOTER_NAV_EVENT, true)
              setPart(CHAT_PART.LEFT)
            }}
            className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
            style={{ backgroundImage: 'url(/assets/arrowIn.png)' }}
          ></div>
          <div className="flex items-center">
            <div
              onClick={() => {
                setPart(CHAT_PART.RIGHT)
              }}
              className="w-8 h-8 rounded-full bg-center bg-contain bg-no-repeat hover:cursor-pointer"
              style={{ backgroundImage: `url(${activeBot.image1})` }}
            ></div>
            <div className="ml-4">{activeBot.name}</div>
          </div>
          <div
            onClick={() => {
              setPart(CHAT_PART.RIGHT)
            }}
            className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
            style={{ backgroundImage: 'url(/assets/arrowOut.png)' }}
          ></div>
        </div>
        <div
          className="p-2 space-y-4 pb-20 overflow-auto"
          style={{ height: 'calc(100% - 3rem)' }}
        >
          {/* 一组对话的结构 */}
          {chatArray.map(item => (
            <div key={item.timestamp} className='w-full'>
              <div className="flex justify-end text-white">
                <div className="max-w-[80vw] space-y-1">
                  <div className="text-sm bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg">
                    {item.dialog.userStr}
                  </div>
                  <div className="text-xs text-right text-[rgba(255,255,255,0.64)]">{formatUnixTimestamp(item.timestamp)}</div>
                </div>
              </div>

              {item.dialog.botStr &&
                <div className="flex justify-start text-white bg-transparent">
                  <div className="max-w-[80vw] space-y-1">
                    <div className="text-sm bg-[#F36C9C] px-3 py-2 rounded-lg">
                      {item.dialog.botStr}
                    </div>
                  </div>
                </div>
              }

              {item.dialog.image &&
                <div className="py-4 flex justify-start text-white bg-transparent">
                  {/* <div className={`w-[300px] h-[400px] aspect-[3/4] rounded-2xl border-8 border-[#F36C9C] bg-center bg-cover bg-no-repeat`} */}
                  <div className={`w-[300px] h-[400px] aspect-[3/4] rounded-xl bg-top bg-cover bg-no-repeat`}
                    style={{ backgroundImage: `url(${item.dialog.image})` }}>
                  </div>
                </div>
              }
            </div>
          ))}

          {result.dialog.userStr && (
            <div className="flex justify-end text-white">
              <div className="max-w-[80vw] space-y-1">
                <div className="text-sm bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg">
                  {result.dialog.userStr}
                </div>
                <div className="text-xs text-right text-[rgba(255,255,255,0.64)]">{formatUnixTimestamp(result.timestamp)}</div>
              </div>
            </div>)}

          {result.timestamp ?
            (result.dialog.botStr ?
              (<div className="flex justify-start text-white bg-transparent">
                <div className="max-w-[80vw] space-y-1">
                  <div className="text-sm bg-[#F36C9C] px-3 py-2 rounded-lg">
                    {result.dialog.botStr}
                  </div>
                </div>
              </div>)
              :
              (<div className="flex justify-start text-white bg-transparent">
                <div className="max-w-[12rem] space-y-1">
                  <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg flex items-center">
                    {new Array(1).fill(0).map((item, index) => (
                      <span key={index} className="loading loading-dots loading-sm text-white"></span>
                    ))}
                  </div>
                </div>
              </div>)
            )
            :
            null}
        </div>
        {/* CHAT CONTENT SEND MESSAGE INPUT */}
        <div className="fixed -bottom-1 w-[100vw] h-[4.5rem] px-4 pr-0 py-3 border-t border-[rgba(255,255,255,0.16)] bg-[#1F1D1F] flex items-center space-x-1">
          {inputShow ?
            <>
              <input
                ref={inputRef}
                onKeyDown={(event) => handleKeyDown(event.key)}
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
                    <div className="w-4 h-5 bg-center bg-contain bg-no-repeat"
                      style={{ backgroundImage: "url(/assets/ask.png)" }}
                    ></div>
                    <span>Ask</span>
                    <div className="w-3 h-3 bg-center bg-contain bg-no-repeat"
                      // className="w-3 h-3 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                      style={{ backgroundImage: "url(/assets/arrowDown.png)" }}
                    ></div>
                  </div>
                  <ul tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >{['Show me...', 'Send me...', 'Can I see...'].map((item) => (
                    <li key={item}>
                      <a>{item}</a>
                    </li>
                  ))}
                  </ul>
                </div>
              </div>
              <div
                onClick={() => handleSendMessage()}
                className="w-10 h-10 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                style={{ backgroundImage: "url(/assets/send.png)" }}
              ></div>
            </>
            :
            <div className='w-full py-2 rounded-xl bg-white text-base text-center'>Please wait! {activeBot.name} is writing...</div>
          }
        </div>
      </div>
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
