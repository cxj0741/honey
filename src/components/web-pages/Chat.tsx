'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import { getUserToBotDetail } from '@/request'
import { useEffect, useState } from 'react'

export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [fold, setFold] = useState(false)
  const [currentArray, setCurrentArray] = useState(userBotArray)
  const [bot] = userBotArray.filter(item => item.id === botId)
  const [activeBot, setActiveBot] = useState(bot)
  const getDetail = async (item: any) => {
    try {
      const { timestamp, botStr, conversationId } = await getUserToBotDetail(item.id)
      const arr = [...currentArray]
      const ele = arr.find(bot => bot.id === item.id)
      ele!.lastTime = timestamp
      ele!.botStr = botStr
      arr.sort((prev, cur) => cur.lastTime - prev.lastTime)
      setCurrentArray([...arr])
      if (conversationId) {
        localStorage.setItem(item.id, conversationId)
      } else {
        localStorage.setItem(item.id, '')
      }
    } catch (error) {
      console.error('getDetail error', error)
    }
  }

  useEffect(() => {
    getDetail(activeBot)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBot])

  // const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsMounted(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!isMounted) {
    return null; // 或者返回一个加载指示器
  }
  
  return (
    <div className="flex-1 flex">
      <ChatLeft activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} />
      <ChatMiddle fold={fold} setFold={setFold} activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} />
      {
        windowWidth > 1280 &&
        <ChatRight fold={fold} activeBot={activeBot} />
      }
      {
        windowWidth < 1280 &&
        <div className={`${fold ? 'hidden' : 'block'}`}>
          <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
            <div
              onClick={() => {
                setFold(true)
                console.log('fold', fold)
              }}
              className="z-50 absolute top-7 right-7 w-7 h-7 bg-center bg-contain bg-no-repeat bg-white rounded-full hover:cursor-pointer"
              style={{ backgroundImage: "url(/assets/close.png)" }}
            ></div>
            <ChatRight fold={fold} activeBot={activeBot} />
          </div>
        </div>
      }
    </div>
  )
}