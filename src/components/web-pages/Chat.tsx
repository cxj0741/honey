'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import { getUserToBotDetail } from '@/request'
import { useEffect, useState } from 'react'

export default function Chat({ userBotArray, usersToBotsArray, botId }: { userBotArray: Record<string, any>[], usersToBotsArray: Record<string, any>[], botId: string }) {
  const [fold, setFold] = useState(false)
  const [currentArray, setCurrentArray] = useState(userBotArray.map(item => ({ ...item, show: true })))
  const [bot] = userBotArray.filter(item => item.id === botId)
  const [activeBot, setActiveBot] = useState(bot)
  const [timeArray, setTimeArray] = useState(usersToBotsArray)
  const getDetail = async (item: any) => {
    if (!item) { return }
    try {
      const { timestamp, botStr, conversationId } = await getUserToBotDetail(item.id)
      const array = timeArray.map(relation => {
        if (relation.botId === item.id) {
          relation.timestamp = timestamp
          relation.botStr = botStr
          // console.log('relation', relation)
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  return (
    <div className="flex-1 flex">
      <ChatLeft activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} timeArray={timeArray} />
      <ChatMiddle fold={fold} setFold={setFold} activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} windowWidth={windowWidth} />
      {
        windowWidth > 1024 &&
        <ChatRight fold={fold} activeBot={activeBot} />
      }
    </div>
  )
}