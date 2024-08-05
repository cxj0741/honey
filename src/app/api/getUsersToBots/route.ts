import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { usersToBots } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  // console.log('id>>>', id)
  let bots = await db
    .select()
    .from(usersToBots)
    .where(
      sql`${usersToBots.userId} = ${userId}`
    )
  return NextResponse.json(bots || [])
}
