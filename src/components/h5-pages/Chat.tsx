'use client'
import ChatLeft from '@/components/h5/ChatLeft'
import ChatMiddle from '@/components/h5/ChatMiddle'
import ChatRight from '@/components/h5/ChatRight'
import SubscribeDialog from '@/components/h5/SubscribeDialog'
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
      {part === CHAT_PART.LEFT &&
        <ChatLeft setPart={setPart}
          activeBot={activeBot}
          setActiveBot={setActiveBot}
          currentArray={currentArray}
          setCurrentArray={setCurrentArray}
          time={time} />}
      {/* {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} setDialogShow={setDialogShow} />} */}
      {/* {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} setDialogShow={setDialogShow} activeBot={activeBot} setActiveBot={setActiveBot}/>} */}
      {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} activeBot={activeBot} setActiveBot={setActiveBot} />}
      {part === CHAT_PART.RIGHT && <ChatRight setPart={setPart} />}
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
