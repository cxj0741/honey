import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'
import sha256 from 'crypto-js/sha256'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') as string
  let str = searchParams.get('str') as string
  if(name === 'password'){
    str = sha256(str).toString()
  }
  const userId = await getUserId()
  console.log('userId', userId, str)
  await db
    .update(users)
    .set({ [name]: str })
    .where(sql`${users.id} = ${userId}`)
  return NextResponse.json({message:'change info success'})
}
