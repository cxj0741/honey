'use client'
import ChatLeft from '@/components/h5/ChatLeft'
import ChatMiddle from '@/components/h5/ChatMiddle'
import ChatRight from '@/components/h5/ChatRight'
import { getUserToBotDetail } from '@/request'
import { useEffect, useState } from 'react'

export const CHAT_PART = {
  LEFT: 'LEFT',
  MIDDLE: 'MIDDLE',
  RIGHT: 'RIGHT',
}


export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [part, setPart] = useState(CHAT_PART.LEFT)
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

  return (
    <>
      {part === CHAT_PART.LEFT &&
        <ChatLeft setPart={setPart}
          activeBot={activeBot}
          setActiveBot={setActiveBot}
          currentArray={currentArray}
          setCurrentArray={setCurrentArray} />}
      {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} activeBot={activeBot} setActiveBot={setActiveBot} />}
      {part === CHAT_PART.RIGHT && <ChatRight setPart={setPart} activeBot={activeBot} />}
    </>
  )
}
