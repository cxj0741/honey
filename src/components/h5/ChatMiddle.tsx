import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { sendMessage } from '@/request/handleStream'
import { getDialogs, getUserInfo, saveDialog, setConversationId } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import { getSession, useSession } from 'next-auth/react'
import { findUrlInString } from '@/utils/findUrlInString'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'
import { useRouter } from 'next/navigation'
import { CHAT_PART } from '@/components/h5-pages/Chat'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'

interface Props {
  setPart: Function
  activeBot: Record<string, any>
  setActiveBot: Function
}

export default function ChatMiddle({ setPart, activeBot, setActiveBot }: Props) {
  const { toast, handleToast } = useToast()
  const router = useRouter()
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
    try {
      const res = await getDialogs(activeBot.id)
      setChatArray(res)
      setTimeout(() => {
        if (chatContainer && chatContainer.current) {
          (chatContainer.current as any).scrollTop = (chatContainer.current as any).scrollHeight
        }
      }, 100)
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'get dialogs error! please try later!')
      throw 'getDialog Error!'
    }
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

    try {
      const { messages, tokens } = await getUserInfo()
      console.log('messages, tokens', messages, tokens)
      if (messages <= 0) {
        setDialogShow(true)
        return
      }
      if (tokens <= 0) {
        console.log('tokens', tokens)
      }
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'get user info error!')
    }

    setInputShow(false);
    (inputRef!.current as any).value = ''
    const timestamp = Date.now()

    setResult({ timestamp, dialog: { userStr, botStr: '', image: '' } })
    try {
      let [botStr, images, conversationId] = (await sendMessage(activeBot.key, { user: (session.data?.user as any)?.id, userStr, conversationId: localStorage.getItem(activeBot.id) || '' })) as [string, string[], string]
      let image: string = ''
      if (images.length) {
        image = images[0]
        console.log('>>>>>images', images)
      } else {
        image = findUrlInString(botStr)
        console.log('image', image)
      }
      botStr = botStr.replace(image, '')
      setResult({ timestamp, dialog: { userStr, botStr, image } })
      // console.log('succeed send message>>>>> set', botStr, image, conversationId)
      // console.log('conversationId>>>>> set', activeBot.id, conversationId)
      if (!localStorage.getItem(activeBot.id)) {
        localStorage.setItem(activeBot.id, conversationId)
        await setConversationId(activeBot.id, conversationId)
      }
      if (botStr) {
        await saveDialog({ botId: activeBot.id, timestamp, dialog: { userStr, botStr, image } })
        if (image) {
          // 这里是为了更新tokens
          const newSession = await getSession();
          session.update(newSession)
        }
      }
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'generate or save dialog error!')
      await saveDialog({ botId: activeBot.id, timestamp, dialog: { userStr, botStr: '', image: '' } })
    } finally {
      setActiveBot({ ...activeBot })
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
  const handleInputPrompt = (str: string) => {
    (inputRef!.current as any).value = str
  }
  const [activeImage, setActiveImage] = useState('')
  const [imageShow, setImageShow] = useState(false)

  return (
    <>
      <div className="bg-center bg-cover bg-no-repeat" style={{ backgroundImage: 'url(/assets/chatMiddleBg.png)' }}>
        {/* HEADER */}
        <div className="z-50 fixed top-16 left-0 w-[100vw]  text-black">
          <div className="h-12 px-4 bg-white flex items-center justify-between">
            <div
              onClick={() => {
                emitter.emit(FOOTER_NAV_EVENT, true)
                setPart(CHAT_PART.LEFT)
              }}
              className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
              style={{ backgroundImage: 'url(/assets/arrowLeft.png)' }}
            ></div>
            <div className="flex items-center">
              <div
                onClick={() => {
                  setPart(CHAT_PART.RIGHT)
                }}
                className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat hover:cursor-pointer"
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
          <div className="h-6" style={{ background: 'linear-gradient( 180deg, #FDFDFD 0%, rgba(253,253,253,0) 100%)' }}></div>
        </div>
        {/* CHAT WINDOW */}
        <div ref={chatContainer} className="px-4 pb-20 space-y-4 text-sm">
          {/* START */}
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
            <div className='ml-2 max-w-[60%]'>
              <div className="px-2 py-3 rounded-lg rounded-tl-sm bg-[#F86C9E] text-white break-words">{activeBot.start || 'hello world'}</div>
              {/* <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)]">00:00</div> */}
            </div>
          </div>
          {/* DIALOG */}
          {chatArray.map(item => (
            <div key={item.timestamp} className="w-full">
              <div className="flex flex-row-reverse items-start">
                <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat bg-sky-800" style={{ backgroundImage: `url(${session?.data?.user?.image})` }}></div>
                <div className='mr-2 max-w-[60%]'>
                  <div className="px-2 py-3 rounded-lg rounded-tr-sm bg-[rgba(0,0,0,0.08)] text-black break-words">{item.dialog.userStr}</div>
                  <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)] text-right">{formatUnixTimestamp(item.timestamp)}</div>
                </div>
              </div>

              {item.dialog.botStr &&
                (<div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
                  <div className='ml-2 max-w-[60%]'>
                    <div className="px-2 py-3 rounded-lg rounded-tl-sm bg-[#F86C9E] text-white break-words">{item.dialog.botStr}</div>
                    {/* <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)]">00:00</div> */}
                  </div>
                </div>)
              }

              {item.dialog.image &&
                (<div className="py-4 flex justify-start bg-transparent">
                  <div
                    onClick={() => {
                      setActiveImage(item.dialog.image)
                      setImageShow(true)
                    }}
                    className={`w-[300px] h-[400px] aspect-[3/4] rounded-xl bg-top bg-cover bg-no-repeat`}
                    style={{ backgroundImage: `url(${item.dialog.image})` }}
                  >
                  </div>
                </div>)
              }
            </div>
          ))}
          {/* CURRENT DIANLOG */}
          <div className="w-full">
            {result.dialog.userStr &&
              (<div className="flex flex-row-reverse items-start">
                <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat bg-sky-800" style={{ backgroundImage: `url(${session?.data?.user?.image})` }}></div>
                <div className='mr-2 max-w-[60%]'>
                  <div className="px-2 py-3 rounded-lg rounded-tr-sm bg-[rgba(0,0,0,0.08)] text-black break-words">{result.dialog.userStr}</div>
                  <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)] text-right">{formatUnixTimestamp(result.timestamp)}</div>
                </div>
              </div>)
            }
            {(result.timestamp !== 0) &&
              (result.dialog.botStr ?
                (<div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
                  <div className='ml-2 max-w-[60%]'>
                    <div className="px-2 py-3 rounded-lg rounded-tl-sm bg-[#F86C9E] text-white break-words">{result.dialog.botStr}</div>
                    {/* <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)]">00:00</div> */}
                  </div>
                </div>)
                :
                (<div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
                  <div className='ml-2'>
                    <div className="w-40 h-12 rounded-lg rounded-tl-sm bg-[#F86C9E] flex items-center justify-center">
                      <div className="loading loading-dots loading-sm text-white"></div>
                      <div className="loading loading-dots loading-sm text-white"></div>
                    </div>
                  </div>
                </div>)
              )
            }
          </div>
          {/* </div> */}
        </div>
        <div className="fixed left-0 bottom-0 w-full px-4 pb-4">
          {inputShow ?
            <div className='p-1 rounded-lg bg-white flex items-center'>
              <input
                ref={inputRef}
                onKeyDown={(event) => handleKeyDown(event.key)}
                type="text"
                placeholder="Type a message"
                className="input input-bordered input-sm flex-1" />
              <div className="dropdown dropdown-top dropdown-end">
                <div
                  tabIndex={0}
                  className="text-white flex items-center justify-between"
                >
                  <div
                    className="w-16 h-10 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                    style={{ backgroundImage: "url(/assets/ask.png)" }}
                  ></div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-32 p-2 shadow"
                >
                  {['Show me', 'Send me', 'Can I see'].map((item) => (
                    <li key={item} onClick={() => handleInputPrompt(item)}>
                      <span>{item}...</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                onClick={() => handleSendMessage()}
                className="w-8 h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                style={{ backgroundImage: "url(/assets/send.png)" }}
              ></div>
            </div>
            :
            <div className='w-full py-2 rounded-xl bg-white text-base text-center'>{activeBot.name} is responding...</div>
          }
        </div>
      </div>
      {/* </div> */}
      <dialog onClick={() => setImageShow(false)} open={imageShow} className="modal bg-[rgba(0,0,0,0.8)]">
        <div className="modal-box aspect-[3/4] p-0 rounded-none bg-transparent">
          <Image
            layout="fill"
            objectFit="contain"
            src={activeImage}
            alt={'bot'}
          />
        </div>
      </dialog>
      {toast.show && <Toast type={toast.type} message={toast.message} />}
      <div className={`${dialogShow ? 'block' : 'hidden'}`}>
        <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/premiumDialogToastBg.png)' }}
        >
          <div className="relative w-[918px] h-[602px] bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: 'url(/assets/premiumDialogBg.png)' }}
          >
            <div onClick={() => { setDialogShow(false) }} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-20 right-12 hover:cursor-pointer"
              style={{ backgroundImage: "url(/assets/close.png)" }}
            ></div>
            <div onClick={() => router.push('/premium')} className="w-[300px] h-12 bg-center bg-contain bg-no-repeat absolute bottom-32 right-[120px] hover:cursor-pointer"
              style={{ backgroundImage: "url(/assets/premiumDialogButton.png)" }}
            ></div>
            <div className="w-[290px] h-[386px] rounded-lg  bg-top bg-cover bg-no-repeat absolute left-20 top-28 hover:cursor-pointer"
              style={{ backgroundImage: `url(${activeBot.image1})` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  )
}
