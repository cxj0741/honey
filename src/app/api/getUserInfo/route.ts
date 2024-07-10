import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  let [user] = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${userId}`)
  return NextResponse.json(user)
}
