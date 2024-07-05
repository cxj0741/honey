import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { isMobile } from './detectDevice';
import StyleLoad from '@/components/h5/StyleLoad'
import Nav from '@/components/h5/Nav'
import FooterNav from '@/components/h5/FooterNav'
import LoginDialog from '@/components/h5/LoginDialog'
import LeftNav from '@/components/web/LeftNav'


import AuthProvider from '@/app/auth/Provider'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'honeybun',
  description: 'honeybun',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode,
}>) {
  if (isMobile()) {
    return (
      <html lang="en">
        <body className={`${inter.className}`}>
          <AuthProvider>
            <Nav />
            <FooterNav />
            <div className="relative z-0 pt-16 pb-14 min-h-[100vh]">
              {children}
            </div>
            <LoginDialog type="Sign In" setType={() => { }} />
            <StyleLoad />
          </AuthProvider>

        </body>
      </html>
    )
  } else {
    return (
      <html lang="en">
        <body className={`${inter.className} flex w-[100vw] h-[100vh]`}>
          <AuthProvider>
            <LeftNav />
            {children}
          </AuthProvider>
        </body>
      </html>
    )
  }

}
