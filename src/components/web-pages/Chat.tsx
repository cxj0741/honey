'use client'
import ChatLeft from '@/components/web/ChatLeft'
import ChatMiddle from '@/components/web/ChatMiddle'
import ChatRight from '@/components/web/ChatRight'
import SubscribeDialog from '@/components/web/SubscribeDialog'
import { useState } from 'react'

export default function Chat() {
  const [fold, setFold] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)

  return (
    <>
      <div className="p-4 flex-1 flex">
        <ChatLeft />
        <ChatMiddle fold={fold} setFold={setFold} />
        <ChatRight fold={fold} />
      </div>
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
