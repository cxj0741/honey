'use client'
import { useState } from 'react'
import WebLoginDialog from '@/components/web/LoginDialog'
import H5LoginDialog from '@/components/h5/LoginDialog'
import { ACCOUNT } from '@/utils'

export function Login({ isMobile }: { isMobile: boolean }) {
  const [type, setType] = useState(ACCOUNT.SIGN_IN)
  const [dialogShow, setDialogShow] = useState(true)

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
