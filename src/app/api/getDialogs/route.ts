import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { chats } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  // console.log('id>>>', id)
  let chatArray = await db
    .select()
    .from(chats)
    .where(sql`${chats.botId} = ${id} AND ${chats.userId} = ${userId}`)
    .orderBy(sql`${chats.timestamp} asc`)
  chatArray = chatArray.map((item) => ({
    ...item,
    dialog: JSON.parse(item.dialog),
  }))
  return NextResponse.json(chatArray)
}
