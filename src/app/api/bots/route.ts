import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/server/db'
import { bots } from '@/server/db/schema'

export async function GET(request: NextRequest) {
  // console.log('----------', request, '----------')
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  console.log('type>>>', type)
  // const endType = searchParams.get('endType')
  // console.log('endType>>>', endType)
  const botsList = await db
    .select()
    .from(bots)
    .where(sql`${bots.type} = ${type}`)
  // console.log('botsList', botsList)
  return NextResponse.json(botsList)
}
