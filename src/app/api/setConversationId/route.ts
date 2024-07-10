import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/server/db'
import { usersToBots } from '@/server/db/schema'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const conversationId = searchParams.get('conversationId')
  const userId = await getUserId()
  console.log('id>>>', id, userId)
  await db
    .update(usersToBots)
    .set({ conversationId })
    .where(
      sql`${usersToBots.botId} = ${id} AND ${usersToBots.userId} = ${userId}`
    )
  return NextResponse.json({ message: 'update conversationId success!' })
}
