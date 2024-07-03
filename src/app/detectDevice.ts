import { headers } from 'next/headers'

export function isMobile() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = /mobile/i.test(userAgent)
  console.log('isMobile', isMobile)
  return isMobile
}
