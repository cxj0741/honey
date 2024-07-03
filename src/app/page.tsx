import { isMobile } from './detectDevice'
import WebHome from '@/components/web-pages/Home'
import H5Home from '@/components/h5-pages/Home'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'

export default async function Home() {
  const data = await getServerSession(authOptions)
  console.log('getServerSession', data)
  return isMobile() ? <H5Home /> : <WebHome />
}
