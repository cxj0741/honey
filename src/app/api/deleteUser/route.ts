import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  const res = await db.delete(users).where(sql`${users.id} = ${userId}`)
  console.log('delete user', res)
  return NextResponse.json({ message: 'delete user success!' })
}
