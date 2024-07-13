import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { sendMessage } from '@/request/handleStream'
import { deleteBotDialogs, getDialogs, getUserInfo, saveDialog, setConversationId } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import SubscribeDialog from '@/components/web/SubscribeDialog'
import ConfirmDialog from '@/components/web/ConfirmDialog'
import { getSession, useSession } from 'next-auth/react'
import { findUrlInString } from '@/utils/findUrlInString'

interface Props {
  fold: boolean
  setFold: Function
  activeBot: Record<string, any>
  setActiveBot: Function
}

export default function ChatMiddle({ fold, setFold, activeBot, setActiveBot }: Props) {
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

    setResult({ timestamp, dialog: { userStr, botStr: '', image: '' } })
    try {
      const [botStr, images, conversationId] = (await sendMessage(activeBot.key, { user: (session.data?.user as any)?.id, userStr, conversationId: localStorage.getItem(activeBot.id) || '' })) as [string, string[], string]
      let image: string = ''
      if (images.length) {
        image = images[0]
        console.log('>>>>>images', images)
      } else {
        image = findUrlInString(botStr)
        console.log('image', image)
      }
      setResult({ timestamp, dialog: { userStr, botStr, image } })
      console.log('succeed send message>>>>> set', botStr, image, conversationId)
      console.log('conversationId>>>>> set', activeBot.id, conversationId)
      if (!localStorage.getItem(activeBot.id)) {
        localStorage.setItem(activeBot.id, conversationId)
        await setConversationId(activeBot.id, conversationId)
      }
      if (botStr) {
        await saveDialog({ botId: activeBot.id, timestamp, dialog: { userStr, botStr, image }, })
        if (image) {
          const newSession = await getSession();
          session.update(newSession)
        }
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

  const [open, setOpen] = useState(false)
  const deleteDialogs = async () => {
    await deleteBotDialogs(activeBot.id)
    setActiveBot({ ...activeBot })
  }
  const handleOpenDialog = () => {
    setOpen(true)
  }
  const handleConfirm = async () => {
    setOpen(false)
    try {
      await deleteDialogs()
    } catch (error) {
      console.error('handleConfirm error', error)
    }
  }
  const handleInputPrompt = (str: string) => {
    (inputRef!.current as any).value = str
  }
  const [activeImage, setActiveImage] = useState('')
  const [imageShow, setImageShow] = useState(false)
  return (
    <>
      <div className="flex-[3] bg-[#1F1D1F] relative">
        {/* CHAT CONTENT HEADER */}
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.16)] text-white flex items-center">
          <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}>
          </div>
          <div className="ml-4 text-xl">
            {activeBot.name}
          </div>
          <div className="grow flex justify-end items-center space-x-4">
            <div
              onClick={() => handleOpenDialog()}
              className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
              style={{ backgroundImage: 'url(/assets/refresh.png)' }}
            ></div>
            <div
              onClick={() => setFold(!fold)}
              className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
              style={{ backgroundImage: fold ? "url(/assets/arrowIn.png)" : "url(/assets/arrowOut.png)" }}
            ></div>
          </div>
        </div>
        {/* CHAT CONTENT DIALOG AREA */}
        <div
          ref={chatContainer}
          className="pl-6 pr-2 py-4 pb-60 overflow-scroll"
          style={{ height: 'calc(100% - 80px)' }}
        >
          {/* 一组对话的结构 */}
          {chatArray.map(item => (
            <div key={item.timestamp} className='w-full'>
              <div className="py-4 flex justify-end text-white">
                <div className="max-w-[450px] space-y-2">
                  <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg break-words">
                    {item.dialog.userStr}
                  </div>
                  <div className="text-xs text-right">{formatUnixTimestamp(item.timestamp)}</div>
                </div>
              </div>
              {item.dialog.botStr &&
                <div className="py-4 flex justify-start text-white bg-transparent">
                  <div className="max-w-[450px] space-y-2">
                    <div className="bg-[#F36C9C] px-3 py-2 rounded-lg break-words">
                      {item.dialog.botStr}
                    </div>
                    {/* <div className="text-xs text-left">10:36</div> */}
                  </div>
                </div>
              }
              {item.dialog.image &&
                <div className="py-4 flex justify-start text-white bg-transparent">
                  <div
                    onClick={() => {
                      setActiveImage(item.dialog.image)
                      setImageShow(true)
                    }}
                    // className={`w-[300px] h-[400px] aspect-[3/4] rounded-2xl border-8 border-[#F36C9C] bg-center bg-cover bg-no-repeat`} 
                    className={`w-[300px] h-[400px] aspect-[3/4] rounded-xl bg-top bg-cover bg-no-repeat`}
                    style={{ backgroundImage: `url(${item.dialog.image})` }}>
                  </div>
                </div>
              }
            </div>
          ))}

          {result.dialog.userStr && (<div className="flex justify-end text-white">
            <div className="max-w-[450px] space-y-2">
              <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg break-words">
                {result.dialog.userStr}
              </div>
              <div className="text-xs text-right">{formatUnixTimestamp(result.timestamp)}</div>
            </div>
          </div>)}

          {result.timestamp ?
            (result.dialog.botStr ?
              (<div className="flex justify-start text-white bg-transparent">
                <div className="max-w-[450px] space-y-2">
                  <div className="bg-[#F36C9C] px-3 py-2 rounded-lg break-words">
                    {result.dialog.botStr}
                  </div>
                </div>
              </div>)
              :
              (<div className="flex justify-start text-white bg-transparent">
                <div className="max-w-[450px] space-y-2">
                  <div className="bg-[rgba(255,255,255,0.16)] px-3 py-2 rounded-lg break-words flex items-center">
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
        <div className="absolute -bottom-[0.5px] w-full px-6 pb-4 bg-[#1F1D1F] flex items-center space-x-2">
          {/* 这里可以使用textarea设置换行 */}
          {inputShow ?
            <>
              <input
                ref={inputRef}
                onKeyDown={(event) => handleKeyDown(event.key)}
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
                    <div
                      className="w-4 h-5 bg-center bg-contain bg-no-repeat"
                      style={{ backgroundImage: "url(/assets/ask.png)" }}
                    ></div>
                    <span>Ask</span>
                    <div
                      className="w-3 h-3 bg-center bg-contain bg-no-repeat"
                      // className="w-3 h-3 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                      style={{ backgroundImage: "url(/assets/arrowUp.png)" }}
                    ></div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-52 p-2 shadow"
                  >
                    {['Show me', 'Send me', 'Can I see'].map((item) => (
                      <li key={item} onClick={() => handleInputPrompt(item)}>
                        <span>{item}...</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                onClick={() => handleSendMessage()}
                className="w-12 h-12 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                style={{ backgroundImage: "url(/assets/send.png)" }}
              ></div>
            </>
            :
            <div className='w-full py-2 rounded-xl bg-white text-base text-center'>Please wait! {activeBot.name} is writing...</div>
          }
        </div>
      </div>
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
      <ConfirmDialog title={'Are you sure you want to refresh dialogs?'} open={open} setOpen={setOpen} handleConfirm={() => handleConfirm()} />
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
    </>
  )
}
