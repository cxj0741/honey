// import { isMobile } from '@/app/detectDevice'
'use client'
import { getOrderInfo } from '@/request'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const PAY_STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PROGRESS: 'progress'
}
const MAX_TRiES = 20
let counter = 0
export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const [status, setStauts] = useState(PAY_STATUS.PROGRESS)
  const getOrder = useCallback(async (orderId: string) => {
    const { status } = await getOrderInfo(orderId)
    if (status === PAY_STATUS.PROGRESS) {
      if (counter >= MAX_TRiES) {
        setStauts(PAY_STATUS.FAILURE)
        setTimeout(() => {
          router.replace('/')
        }, 3000)
        return
      } else {
        console.log('counter', counter)
        counter += 1
        setTimeout(async () => await getOrder(orderId), 10000)
        return
      }
    }
    if (status === PAY_STATUS.SUCCESS) {
      setStauts(PAY_STATUS.SUCCESS)
      setTimeout(() => {
        router.replace('/')
      }, 3000)
      return
    }
    if (status === PAY_STATUS.FAILURE) {
      setStauts(PAY_STATUS.FAILURE)
      setTimeout(() => {
        router.replace('/')
      }, 3000)
      return
    }
  }, [router])

  useEffect(() => {
    if (!orderId) { return }
    getOrder(orderId)
  })

  return (
    <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
      <div className="w-80 h-32 rounded-lg bg-white flex items-center justify-center text-lg font-semibold text-center">
        {status === PAY_STATUS.PROGRESS && <div>Please wait a moment!</div>}
        {status !== PAY_STATUS.PROGRESS &&
          <div>
            {status === PAY_STATUS.SUCCESS && <div>Order Success!</div>}
            {status === PAY_STATUS.FAILURE && <div>Order Failure!</div>}
            <div>Navigate To Home after 3 seconds!</div>
          </div>
        }
      </div>
    </div >
  )
}
