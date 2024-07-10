import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { chats, users } from '@/server/db/schema'
import { getUserId } from '@/utils/getUserId'
import { sql } from 'drizzle-orm/sql'

async function streamToArrayBuffer(stream: ReadableStream) {
  const reader = stream.getReader()
  const chunks = []
  let done = false
  while (!done) {
    const { value, done: readerDone } = await reader.read()
    done = readerDone
    if (value) {
      chunks.push(value)
    }
  }
  const arrayBuffer = new Uint8Array(
    chunks.reduce((acc, val) => acc.concat(Array.from(val)), [])
  ).buffer
  return arrayBuffer
}

export async function POST(request: NextRequest) {
  const userId = await getUserId()
  
  if(!request.body){
    return NextResponse.json({message: 'empty!'})
  }
  const arrayBuffer = await streamToArrayBuffer(request.body as ReadableStream)
  const text = new TextDecoder('utf-8').decode(arrayBuffer)
  const body: {botId:string, timestamp:number, dialog:Record<string,any>} = JSON.parse(text)
  const { botId, timestamp, dialog } = body
  await db
    .insert(chats)
    .values({ userId, botId, timestamp, dialog: JSON.stringify(dialog) })

  const [user] = await db.select().from(users).where(sql`${users.id} = ${userId}`)
  if((user.messages as number) > 0){
    await db.update(users).set({messages: (user.messages as number) - 1}).where(sql`${users.id} = ${userId}`)
  }
  if(dialog.image && (user.tokens as number) > 0){
    await db.update(users).set({messages: (user.tokens as number) - 2}).where(sql`${users.id} = ${userId}`)
  }
  return NextResponse.json({ message: 'save dialog success!' })
}