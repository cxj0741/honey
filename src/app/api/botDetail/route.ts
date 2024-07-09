import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/server/db'
import { bots } from '@/server/db/schema'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  // console.log('id>>>', id)
  const bot = await db
    .select()
    .from(bots)
    .where(sql`${bots.id} = ${id}`)
  console.log('bot', bot)
  return NextResponse.json(bot)
}
