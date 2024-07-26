import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { chats, usersToBots } from '@/server/db/schema'
import { getUserId } from '@/utils/getUserId'
import { sql } from 'drizzle-orm/sql'

export async function POST(request: NextRequest) {
  const userId = await getUserId()

  if (!request.body) {
    return NextResponse.json({ message: 'empty!' })
  }
  const body: {
    botId: string,
    timestamp: number,
    dialog: Record<string, any>,
  } = await request.json()
  // console.log('body', body)
  const { botId, timestamp, dialog } = body
  await db
    .insert(chats)
    .values({ userId, botId, timestamp, dialog: JSON.stringify(dialog) })
  const data = { timestamp }
  if (dialog.botStr) {
    (data as any).botStr = dialog.botStr
  }
  await db
    .update(usersToBots)
    .set(data)
    .where(
      sql`${usersToBots.userId} = ${userId} AND ${usersToBots.botId} = ${botId}`
    )
  // 这里不再更新这两张表格
  // const [user] = await db.select().from(users).where(sql`${users.id} = ${userId}`)
  // if((user.messages as number) > 0){
  //   await db.update(users).set({messages: (user.messages as number) - 1}).where(sql`${users.id} = ${userId}`)
  // }
  // if(dialog.image && (user.tokens as number) > 0){
  //   await db.update(users).set({messages: (user.tokens as number) - 2}).where(sql`${users.id} = ${userId}`)
  // }
  return NextResponse.json({ message: 'save dialog success!' })
}
