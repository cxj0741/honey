'use client'
import { useState, useEffect } from 'react'
import WebLoginDialog from '@/components/web/LoginDialog'
import H5LoginDialog from '@/components/h5/LoginDialog'
import { ACCOUNT } from '@/utils'

export function Login({ isMobile }: { isMobile: boolean }) {
  const [type, setType] = useState(ACCOUNT.SIGN_IN)
  const [dialogShow, setDialogShow] = useState(true)

  useEffect(() => {
    // 发送 Google Analytics 事件
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: 'Login Page',
        page_location: window.location.href,
        page_path: window.location.pathname,
      })
    }
  }, [])

  return isMobile ? (
    <H5LoginDialog
      type={type}
      setType={setType}
      dialogShow={dialogShow}
      setDialogShow={setDialogShow}
    />
  ) : (
    <WebLoginDialog
      type={type}
      setType={setType}
      dialogShow={dialogShow}
      setDialogShow={setDialogShow}
    />
  )
}
