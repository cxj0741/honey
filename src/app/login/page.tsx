import { isMobile } from '@/app/detectDevice'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'
import { redirect } from 'next/navigation'
import { Login } from './Login'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/')
  } else {
    return <Login isMobile={isMobile()} />
  }
}