import { NextRequest, NextResponse } from 'next/server'
// import { middleware } from 'next-auth/middleware'

export default function handler(request: NextRequest) {
  console.log('----------middleware request----------', request.url)
  // return NextResponse.redirect(new URL('/api/auth/token'))
  return NextResponse.next()
}

// export const config = {
//   // 拦截的路径
//   mather: ['/', '/chat'],
// }
