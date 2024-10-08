import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/server/db'
import { chats, usersToBots } from '@/server/db/schema'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const userId = await getUserId()
  // console.log('id>>>', id)
  await db
    .delete(chats)
    .where(sql`${chats.botId} = ${id} AND ${chats.userId} = ${userId}`)
  await db
    .update(usersToBots)
    .set({ conversationId: '' })
    .where(
      sql`${usersToBots.botId} = ${id} AND ${usersToBots.userId} = ${userId}`
    )
  return NextResponse.json({ message: 'Delete dialog success!' })
}
