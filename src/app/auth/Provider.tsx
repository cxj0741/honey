'use client'
import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

export default function Provider({
  children,
}: Readonly<{
  children: ReactNode,
}>) {
  useEffect(() => {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/668fb8eec3fb85929e3e09e5/1i2gmkplk';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, [])
  return <SessionProvider>
    {children}
  </SessionProvider>
}
// SessionProvider是一个context，使用SessionProvider并提供useSession可以获得jwt信息