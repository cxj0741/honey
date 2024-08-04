'use client'
import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

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
  useEffect(() => {
    // Add Google Tag Manager script to head
    const gtmScript = document.createElement('script')
    gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-PG67DMPS');`
    document.head.appendChild(gtmScript)

    // Add Google Tag Manager noscript to body
    const gtmNoScript = document.createElement('noscript')
    gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PG67DMPS"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    document.body.insertBefore(gtmNoScript, document.body.firstChild)
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}
