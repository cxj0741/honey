import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { chats } from '@/server/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'
import { sql } from 'drizzle-orm/sql'

export async function GET(request: NextRequest) {
  const data = await getServerSession(authOptions)
  const userId = data?.user?.id || ''
  if (userId) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    // console.log('id>>>', id)
    let chatArray = await db
      .select()
      .from(chats)
      .where(sql`${chats.botId} = ${id} AND ${chats.userId} = ${userId}`)
    // .where(sql`${chats.botId} = ${id} AND ${chats.userId} = ${userId} ORDER BY time ASC`)
    chatArray = chatArray.map((item) => ({
      ...item,
      dialog: JSON.parse(item.dialog),
    }))
    return NextResponse.json(chatArray)
  }
  return NextResponse.json([])
}
