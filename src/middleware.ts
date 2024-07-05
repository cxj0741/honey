import { NextRequest, NextResponse } from 'next/server'
// export { default } from 'next-auth/middleware'

export default function handler(request: NextRequest) {
  // console.log('----------middleware request----------', request)
  // return NextResponse.redirect(new URL('/api/auth/token'))
  // const { pathname } = new URL(request.url)
  // if (pathname === '/chat') {
  //   return NextResponse.redirect('http://localhost:3000')
  // }
  return NextResponse.next()
}

// export const config = {
//   // 拦截的路径
//   mather: ['/chat', '/become-premium', '/personal-center'],
// }
