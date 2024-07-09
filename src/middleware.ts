export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/chat/:path*', '/become-premium/:path*', '/personal-center/:path*'],
}

// import { NextRequest, NextResponse } from 'next/server'
// export default function handler(request: NextRequest) {
//   console.log('----------middleware request----------', request.url)
//   return NextResponse.next()
// }
