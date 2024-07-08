import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { chats } from '@/server/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'

async function readJSONBody(req: NextRequest) {
  const chunks = []
  for await (const chunk of req.body) {
    chunks.push(chunk)
  }
  const rawBody = Buffer.concat(chunks).toString('utf-8')
  return JSON.parse(rawBody)
}

export async function POST(request: NextRequest) {
  const data = await getServerSession(authOptions)
  const userId = data?.user?.id || ''
  // console.log(
  //   '------saveDialog request------',
  //   request.body instanceof ReadableStream
  // )
  const body = await readJSONBody(request)
  const { botId, timestamp, dialog } = body
  // console.log(
  //   '------body------',
  //   userId,
  //   botId,
  //   timestamp,
  //   JSON.stringify(dialog)
  // )
  if (userId) {
    await db
      .insert(chats)
      .values({ userId, botId, timestamp, dialog: JSON.stringify(dialog) })
  }
  return NextResponse.json({ message: 'save dialog success!' })
}
