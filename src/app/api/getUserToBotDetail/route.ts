import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { usersToBots } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  // console.log('id>>>', id)
  let chatArray = await db
    .select()
    .from(usersToBots)
    .where(
      sql`${usersToBots.botId} = ${id} AND ${usersToBots.userId} = ${userId}`
    )
  return NextResponse.json(chatArray[0])
}
