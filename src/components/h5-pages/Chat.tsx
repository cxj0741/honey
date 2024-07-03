'use client'
import ChatLeft from '@/components/h5/ChatLeft'
import ChatMiddle from '@/components/h5/ChatMiddle'
import ChatRight from '@/components/h5/ChatRight'
import SubscribeDialog from '@/components/h5/SubscribeDialog'
import { useState } from 'react'

export const CHAT_PART = {
  LEFT: 'LEFT',
  MIDDLE: 'MIDDLE',
  RIGHT: 'RIGHT',
}

export default function Chat() {
  const [part, setPart] = useState(CHAT_PART.LEFT)
  const [dialogShow, setDialogShow] = useState(false)

  return (
    <>
      {part === CHAT_PART.LEFT && <ChatLeft setPart={setPart} />}
      {part === CHAT_PART.MIDDLE && <ChatMiddle setPart={setPart} setDialogShow={setDialogShow} />}
      {part === CHAT_PART.RIGHT && <ChatRight setPart={setPart} />}
      <SubscribeDialog dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
