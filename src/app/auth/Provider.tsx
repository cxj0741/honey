'use client'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import Script from 'next/script'
// import { ReactNode, useEffect } from 'react'

export default function Provider({
  children,
}: Readonly<{
  children: ReactNode,
}>) {

  // var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
  /**
  useEffect(() => {
    if (!window.Tawk_API) {
      window.Tawk_API = {};
      window.Tawk_LoadStart = new Date();
      (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/668fb8eec3fb85929e3e09e5/1i2gmkplk';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        (s0.parentNode as any).insertBefore(s1, s0);
      })();
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.hideWidget();
      };
    }
  }, [])
  */
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z2FXJJ25MJ"
        strategy="afterInteractive"
        async
      />
      <Script id="google-analytics" strategy="afterInteractive" onLoad={() => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any) { window.dataLayer.push(args); }
        gtag('js', new Date());
        gtag('config', 'G-Z2FXJJ25MJ');
      }}>
      </Script>
      <SessionProvider>
        {children}
      </SessionProvider>
    </>
  )
}
// SessionProvider是一个context，使用SessionProvider并提供useSession可以获得jwt信息