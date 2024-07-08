'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import SubscribeDialog from '@/components/web/SubscribeDialog'
import { useEffect, useState } from 'react'

export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [fold, setFold] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [activeId, setActiveId] = useState(botId)
  const [activeBot, setActiveBot] = useState({})
  useEffect(() => {
    const [bot] = userBotArray.filter(item => item.id === activeId)
    setActiveBot(bot)
  }, [activeId, userBotArray])

  return (
    <>
      <div className="p-4 pr-0 flex-1 flex">
        <ChatLeft activeId={activeId} setActiveId={setActiveId} userBotArray={userBotArray} />
        <ChatMiddle fold={fold} setFold={setFold} activeId={activeId} userBotArray={userBotArray} />
        <ChatRight fold={fold} bot={activeBot} />
      </div>
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
