'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import { getUserToBotDetail } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import { useEffect, useState } from 'react'

export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [fold, setFold] = useState(false)
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
    <div className="p-4 pr-0 flex-1 flex">
      <ChatLeft activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} />
      <ChatMiddle fold={fold} setFold={setFold} activeBot={activeBot} setActiveBot={setActiveBot} />
      <ChatRight fold={fold} activeBot={activeBot} />
    </div>
  )
}