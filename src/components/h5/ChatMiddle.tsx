import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { audioToText, sendMessage } from '@/request/handleStream'
import { getDialogs, getUserInfo, saveDialog, setConversationId } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import { getSession, useSession } from 'next-auth/react'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'
import { useRouter } from 'next/navigation'
import { CHAT_PART } from '@/components/h5-pages/Chat'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'
import { findContent } from '@/utils/findContent'
// 导入播放按钮
import { SpeakerIcon, MicrophoneIcon } from '@/components/icons';
interface Props {
  setPart: Function
  activeBot: Record<string, any>
  setActiveBot: Function
}

export default function ChatMiddle({ setPart, activeBot, setActiveBot }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
    // 发起文本转语音的api请求
    async function textToSpeech(text: string, user: string, apiKey: string): Promise<string> {
      const url = 'https://aiagent.marsyoo.com/v1/text-to-audio';
      const data = {
        text: text,
        user: user,
        streaming: false
      };
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors', // 确保包含这个
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
      } catch (error) {
        console.error('Error in text-to-speech:', error);
        throw error;
      }
    }
  const playAudio1 = async (text: string, id: number) => {
    if (isPlaying && currentPlayingId === id) {
      // 如果当前正在播放，则停止
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentPlayingId(null);
    } else {
      try {
        setIsPlaying(true);
        setCurrentPlayingId(id);
        
        // 调用文本转语音 API
        const audioUrl = await textToSpeech(text, (session.data?.user as any)?.id, activeBot.key);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(e => {
            console.error('Error playing audio:', e);
            setIsPlaying(false);
            setCurrentPlayingId(null);
          });
          audioRef.current.onended = () => {
            setIsPlaying(false);
            setCurrentPlayingId(null);
          };
        }
      } catch (error) {
        console.error('Error in text-to-speech:', error);
        setIsPlaying(false);
        setCurrentPlayingId(null);
        handleToast(TOAST_TYPE.ERROR, '无法将文本转换为语音');
      }
    }
  };
  // 开始录音
  const startRecording = async () => {
    try {
      // 这行代码请求用户的麦克风权限，并获取音频流。
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 创建一个新的 MediaRecorder 对象，用于录制音频。
      mediaRecorderRef.current = new MediaRecorder(stream);
      // 初始化一个空数组来存储音频数据。
      audioChunksRef.current = [];

      // 当录制音频数据时，将数据推入 audioChunksRef.current 数组。
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // 当停止录制时，将音频数据转换为 Blob 并上传到服务器。
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // 上传音频数据到服务器，语音转文本
        const text = await handleAudioUpload(audioBlob);
  
        handleInputPrompt(text || ''); // 确保 text 不是 undefined
      };

      // 开始录制
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      handleToast(TOAST_TYPE.ERROR, '无法开始录音');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 上传音频数据到服务器，语音转文本
  const handleAudioUpload = async (audioBlob: Blob) => {
    try {
      const audioFile = new File([audioBlob], "recorded_audio.webm", { type: 'audio/webm' });
      
      const text = await audioToText(activeBot.key, audioFile, (session.data?.user as any)?.id);
      
      console.log('Received text from server:', text);

      return text; // 返回转换后的文本

    } catch (error) {
      console.error('Error processing audio:', error);
      handleToast(TOAST_TYPE.ERROR, '无法将音频转换为文本');
    } 
  };

  // 根据isRecording的状态来决定开始录音还是停止录音
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

    // 麦克风相关代码
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
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
    setTimeout(() => {
      if (chatContainer && chatContainer.current) {
        (chatContainer.current as any).scrollTop = (chatContainer.current as any).scrollHeight
      }
    }, 100)
    try {
      let [botStr, images, conversationId] = (await sendMessage(activeBot.key, { user: (session.data?.user as any)?.id, userStr, conversationId: localStorage.getItem(activeBot.id) || '' })) as [string, string[], string]
      let image: string = ''
      let res = findContent(botStr)
      if (Array.isArray(res)) {
        console.log('res', res)
        image = res[1]
        botStr = botStr.replace(res[0], '')
      } else if (typeof res === 'string') {
        console.log('res', res)
        if (res !== '') {
          image = res
          botStr = botStr.replace(res, '')
        } else if (images.length) {
          image = images[0]
          botStr = botStr.replace(image, '')
        }
      }
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
        <div className="z-10 fixed top-12 left-0 w-[100vw] text-black">
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
              className="-mr-4 w-10 h-10 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
              style={{ backgroundImage: 'url(/assets/rightContent.png)' }}
            ></div>
          </div>
          <div className="h-6" style={{ background: 'linear-gradient( 180deg, #FDFDFD 0%, rgba(253,253,253,0) 100%)' }}></div>
        </div>
        {/* CHAT WINDOW */}
        <div ref={chatContainer} className="px-4 py-20 overflow-y-scroll no-scrollbar" style={{ height: 'calc(100vh - 3rem)' }}>
          <div className="space-y-4 text-sm">
            {/* START */}
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
              <div className='ml-2 max-w-[60%]'>

                 <div className="px-2 py-3 rounded-lg rounded-tl-sm bg-[#F86C9E] text-white flex items-center">
                   <span> {activeBot.start || 'Hello world'}</span>

                     {/* dify的文本转语音 */}
                    <button 
                      onClick={() => playAudio1(activeBot.start || 'Hello world', -1)}
                      className="ml-2 p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]"
                      aria-label={isPlaying && currentPlayingId === -1? "Stop audio" : "Play audio"}
                      >
                        <SpeakerIcon className={`w-4 h-4 text-white ${isPlaying && currentPlayingId === -1 ? 'animate-pulse' : ''}`} />
                      </button>
                  </div>
                {/* <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)]">00:00</div> */}
              </div>
            </div>
            {/* DIALOG */}
            {chatArray.map((item, index) => (
              <div key={item.timestamp} className="w-full">
                <div className="flex flex-row-reverse items-start">
                  <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}></div>
                  <div className='mr-2 max-w-[60%]'>
                    <div className="px-2 py-3 rounded-lg rounded-tr-sm bg-[rgba(0,0,0,0.08)] text-black break-words">{item.dialog.userStr}</div>
                    <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)] text-xs text-right">{formatUnixTimestamp(item.timestamp)}</div>
                  </div>
                </div>

                {item.dialog.botStr &&
                  (<div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
                    <div className='ml-2 max-w-[60%]'>
                       {/* flex items-center 加了一个播放按钮使其居中 */}
                       <div className="px-2 py-3 rounded-lg rounded-tl-sm bg-[#F86C9E] text-white flex items-center">
                        <span>{item.dialog.botStr}</span>

                        
                         {/* dify的文本转语音 */}
                    <button 
                      onClick={() => playAudio1(item.dialog.botStr, index)}
                      className="ml-2 p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]"
                      aria-label={isPlaying && currentPlayingId === index ? "Stop audio" : "Play audio"}
                      >
                        <SpeakerIcon className={`w-4 h-4 text-white ${isPlaying && currentPlayingId === index ? 'animate-pulse' : ''}`} />
                      </button>
                       
                        </div>
                      {/* <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)]">00:00</div> */}
                    </div>
                  </div>)
                }

                {item.dialog.image &&
                  (<div className="mt-4 flex items-start">
                    <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
                    <div
                      onClick={() => {
                        setActiveImage(item.dialog.image)
                        setImageShow(true)
                      }}
                      className={`ml-2 w-[60vw] h-[80vw] aspect-[3/4] rounded-xl bg-top bg-cover bg-no-repeat`}
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
                  <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}></div>
                  <div className='mr-2 max-w-[60%]'>
                    <div className="px-2 py-3 rounded-lg rounded-tr-sm bg-[rgba(0,0,0,0.08)] text-black break-words">{result.dialog.userStr}</div>
                    <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)] text-xs text-right">{formatUnixTimestamp(result.timestamp)}</div>
                  </div>
                </div>)
              }
              {(result.timestamp !== 0) &&
                (result.dialog.botStr ?
                  (<div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
                    <div className='ml-2 max-w-[60%]'>
                      <div className="px-2 py-3 rounded-lg rounded-tl-sm bg-[#F86C9E] text-white break-words">{result.dialog.botStr}</div>
                      {/* <div className="mt-1 ml-1 text-[rgba(0,0,0,0.64)]">00:00</div> */}
                    </div>
                  </div>)
                  :
                  (<div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${activeBot.image1})` }}></div>
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
          </div>
        </div>
        <div className="fixed left-0 bottom-0 w-full px-4 pt-8 pb-4 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/chatBg.png)' }}
        >
          {inputShow ?
            <div className='p-1 rounded-lg bg-white flex items-center'>
              <input
                ref={inputRef}
                onKeyDown={(event) => handleKeyDown(event.key)}
                type="text"
                placeholder="Type a message"
                // className="input input-bordered input-sm flex-1" />
                className="px-1 flex-1 active:border-none outline-none" />
                {/* 麦克风图标 */}
              <button
                onClick={toggleRecording}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:cursor-pointer hover:bg-[rgba(0,0,0,0.04)]"
              >
                <MicrophoneIcon 
                  className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} 
                  size={18} 
                />
              </button>
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
              <div className="w-[1px] h-4 bg-[rgba(0,0,0,0.08)]"></div>
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
      {toast.show && <Toast type={toast.type} message={toast.message} />}
      <div className={`${dialogShow ? 'block' : 'hidden'}`}>
        <div onClick={() => { setDialogShow(false) }} className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/h5Assets/premiumDialogToastBg.png)' }}
        >
          <div className="p-2 rounded-lg bg-white">
            <div className="rounded-lg bg-top bg-cover bg-no-repeat"
              style={{ backgroundImage: 'url(/bots/Ashley1.jpg)' }}
            >
              <div className="relative aspect-[327/505] bg-center bg-cover bg-no-repeat"
                style={{ width: 'calc(100vw - 3rem)', backgroundImage: 'url(/h5Assets/premiumDialogBg.png)' }}
              >
                {/* <div onClick={() => { setDialogShow(false) }} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-20 right-12 hover:cursor-pointer"
              style={{ backgroundImage: "url(/assets/close.png)" }}
            ></div> */}
                <div onClick={() => router.push('/premium')} className=" absolute bottom-6 left-2 aspect-[295/48] bg-center bg-contain bg-no-repeat hover:cursor-pointer"
                  style={{ width: 'calc(100% - 1rem)', backgroundImage: "url(/assets/premiumDialogButton.png)" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${imageShow ? 'block' : 'hidden'}`}>
        <div onClick={() => {
          setImageShow(false)
          setActiveImage('')
        }} className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
          <div className="relative aspect-[3/5]" style={{ width: 'calc(100vw - 2rem)' }}>
            {/* <div onClick={() => { setDialogShow(false) }} className="z-50 absolute -top-7 -right-0 w-7 h-7 bg-center bg-contain bg-no-repeat bg-white rounded-full hover:cursor-pointer"
              style={{ backgroundImage: "url(/assets/close.png)" }}
            ></div> */}
            <Image
              layout="fill"
              objectFit="cover"
              objectPosition='top'
              src={activeImage}
              alt={'bot'}
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </>
  )
}
