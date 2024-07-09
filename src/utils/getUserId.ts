import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'

export async function getUserId() {
  const data = await getServerSession(authOptions)
  const userId = (data?.user as any)?.id || ''
  return userId
}
