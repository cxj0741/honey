import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { orders } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  // console.log('id>>>', id)
  let orderArray = await db
    .select()
    .from(orders)
    .where(sql`${orders.userId} = ${userId}`)
  return NextResponse.json(orderArray || [])
}
