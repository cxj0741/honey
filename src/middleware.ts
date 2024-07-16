import withAuth from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
})
export const config = {
  matcher: ['/chat/:path*', '/premium/:path*', '/personal-center/:path*'],
}

// import { NextRequest, NextResponse } from 'next/server'
// export default function handler(request: NextRequest) {
//   console.log('----------middleware request----------', request.url)
//   return NextResponse.next()
// }
