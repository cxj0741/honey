'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import SubscribeDialog from '@/components/web/SubscribeDialog'
import { useState } from 'react'

export default function Chat({ userBotArray, botId }: { userBotArray: Record<string, any>[], botId: string }) {
  const [fold, setFold] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [currentArray, setCurrentArray] = useState([...userBotArray])
  const [bot] = userBotArray.filter(item => item.id === botId)
  const [activeBot, setActiveBot] = useState(bot)

  return (
    <>
      <div className="p-4 pr-0 flex-1 flex">
        <ChatLeft activeBot={activeBot} setActiveBot={setActiveBot} currentArray={currentArray} setCurrentArray={setCurrentArray} />
        <ChatMiddle fold={fold} setFold={setFold} activeBot={activeBot} setActiveBot={setActiveBot} />
        <ChatRight fold={fold} activeBot={activeBot} />
      </div>
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
