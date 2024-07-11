'use client'
import ChatLeft from '@/components/h5/ChatLeft'
import ChatMiddle from '@/components/h5/ChatMiddle'
import ChatRight from '@/components/h5/ChatRight'
import { getUserToBotDetail } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import { useEffect, useState } from 'react'

export const CHAT_PART = {
  LEFT: 'LEFT',
  MIDDLE: 'MIDDLE',
  RIGHT: 'RIGHT',
}

export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [part, setPart] = useState(CHAT_PART.LEFT)
  const [currentArray, setCurrentArray] = useState([...userBotArray])
  const [bot] = userBotArray.filter(item => item.id === botId)
  const [activeBot, setActiveBot] = useState(bot)
  const getDetail = async () => {
    const newArray = []
    for (const item of userBotArray) {
      try {
        const { timestamp, conversationId } = await getUserToBotDetail(item.id)
        newArray.push({ ...item, time: formatUnixTimestamp(timestamp), show: true })
        // console.log('conversationId>>>>>>get', item.id, conversationId)
        if (conversationId) {
          localStorage.setItem(item.id, conversationId)
        } else {
          localStorage.setItem(item.id, '')
        }
      } catch (error) {
        console.error('getDetail error', error)
      }
    }
    setCurrentArray([...newArray] as any)
  }
  useEffect(() => {
    getDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {part === CHAT_PART.LEFT &&
        <ChatLeft setPart={setPart}
          activeBot={activeBot}
          setActiveBot={setActiveBot}
          currentArray={currentArray}
          setCurrentArray={setCurrentArray} />}
      {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} activeBot={activeBot} />}
      {part === CHAT_PART.RIGHT && <ChatRight setPart={setPart} activeBot={activeBot} />}
    </>
  )
}
