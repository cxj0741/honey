import { NextRequest, NextResponse } from 'next/server'
// import { sql } from 'drizzle-orm'
// import { db } from '@/server/db'
// import { bots } from '@/server/db/schema'

// export async function GET(request: NextRequest) {
export async function GET(...args) {
  // const { searchParams } = new URL(request.url)
  // const type = searchParams.get('type')
  // console.log('type>>>', type)
  // const botsList = await db
  //   .select()
  //   .from(bots)
  //   .where(sql`${bots.type} = ${type}`)
  // const args = request
  console.log('request id>>>>>args', args)

  // const botArray = await db
  // .select()
  // .from(bots)
  // .where(sql`${bots.id} = ${id}`)
  return NextResponse.json({ name: 'lee' }, { status: 200 })
}
