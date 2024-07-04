import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/server/db'
import { bots } from '@/server/db/schema'

// const sleep = (time: number) =>
//   new Promise((res, rej) => {
//     setTimeout(res, time)
//   })

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
  // await sleep(5000)
  return NextResponse.json(botsList)
}
