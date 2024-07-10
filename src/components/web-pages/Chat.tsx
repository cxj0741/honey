'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import SubscribeDialog from '@/components/web/SubscribeDialog'
import { getUserToBotDetail } from '@/request'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import { useEffect, useState } from 'react'

export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [fold, setFold] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [currentArray, setCurrentArray] = useState([...userBotArray])
  const [bot] = userBotArray.filter(item => item.id === botId)
  const [activeBot, setActiveBot] = useState(bot)
  // 获取对话起始时间
  const [time, setTime] = useState('00:00')
  const getDetail = async () => {
    try {
      const { timestamp, conversationId } = await getUserToBotDetail(activeBot.id)
      setTime(formatUnixTimestamp(timestamp))
      console.log('conversationId>>>>>>get', activeBot.id, conversationId)
      if (conversationId) {
        localStorage.setItem(activeBot.id, conversationId)
      } else {
        localStorage.setItem(activeBot.id, '')
      }
    } catch (error) {
      console.error('getDetail error', error)
    }
  }
  useEffect(() => {
    getDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBot])

  return (
    <>
      <div className="p-4 pr-0 flex-1 flex">
        <ChatLeft activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} time={time} />
        <ChatMiddle fold={fold} setFold={setFold} activeBot={activeBot} setActiveBot={setActiveBot} />
        <ChatRight fold={fold} activeBot={activeBot} />
      </div>
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
