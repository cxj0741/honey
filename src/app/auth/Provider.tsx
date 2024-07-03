'use client'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function Provider({
  children,
}: Readonly<{
  children: ReactNode,
}>) {
  return <SessionProvider>
    {children}
  </SessionProvider>
}
// SessionProvider是一个context，使用SessionProvider并提供useSession可以获得jwt信息