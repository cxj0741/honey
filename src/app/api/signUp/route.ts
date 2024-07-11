import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import sha256 from 'crypto-js/sha256'
// 生成密钥的时候需要加盐吗

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = schema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 })
  }
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, body.email),
  })

  if (user) {
    return NextResponse.json({ error: 'User already exists!' }, { status: 400 })
  }
  //  eq(users.hashPassword, sha256(password).toString())
  const hashPassword = sha256(body.password).toString()
  const [newUser] = await db
    .insert(users)
    .values({ email: body.email, hashPassword, name: body.email })
    .returning()

  return NextResponse.json({
    ok: true,
    email: newUser.email,
  })
}
