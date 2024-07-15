import { useCallback, useState } from 'react'

interface Props {
  type: typeof TOAST_TYPE.INFO | typeof TOAST_TYPE.SUCCESS | typeof TOAST_TYPE.WARNING | typeof TOAST_TYPE.ERROR
  message: string
}

export const TOAST_TYPE = {
  INFO: 'alert-info',
  SUCCESS: 'alert-success',
  WARNING: 'alert-warning',
  ERROR: 'alert-error'
}

export const toastInfo = {
  show: false,
  type: TOAST_TYPE.INFO,
  message: '',
}

export function useToast() {
  const [toast, setToast] = useState({ ...toastInfo })
  const handleToast = useCallback((type: string, message: string) => {
    setToast({
      show: true,
      type,
      message
    })
    setTimeout(() => {
      setToast({ ...toastInfo })
    }, 2000)
  }, [])
  return { toast, handleToast }
}

export default function Toast({ type, message }: Props) {
  return (
    <div className="z-50 toast toast-center toast-top">
      <div className={`alert ${type}`}>
        <span className='text-white font-semibold'>{message}</span>
      </div>
    </div>
  )
}