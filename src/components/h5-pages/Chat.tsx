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


export default function Chat({ userBotArray, usersToBotsArray, botId }: { userBotArray: Record<string, any>[], usersToBotsArray: Record<string, any>[], botId: string }) {
  const [part, setPart] = useState(CHAT_PART.LEFT)
  const [currentArray, setCurrentArray] = useState(userBotArray.map(item => ({ ...item, show: true })))
  const [bot] = userBotArray.filter(item => item.id === botId)
  const [activeBot, setActiveBot] = useState(bot)
  const [timeArray, setTimeArray] = useState(usersToBotsArray)
  const getDetail = async (item: any) => {
    try {
      const { timestamp, conversationId } = await getUserToBotDetail(item.id)
      const array = timeArray.map(relation => {
        if (relation.botId === item.id) {
          relation.timestamp = timestamp
        }
        return relation
      })
      setTimeArray(array)
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
          setCurrentArray={setCurrentArray}
          timeArray={timeArray} />}
      {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} activeBot={activeBot} setActiveBot={setActiveBot}/>}
      {part === CHAT_PART.RIGHT && <ChatRight setPart={setPart} activeBot={activeBot} />}
    </>
  )
}
