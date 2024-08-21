// import { isMobile } from '@/app/detectDevice'
'use client'
import { getOrderInfo } from '@/request'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const PAY_STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PROGRESS: 'progress',
}
const MAX_TRiES = 10
let counter = 0
export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const [status, setStauts] = useState(PAY_STATUS.PROGRESS)

  // 发送支付事件到 GTM
  const sendPaymentEventToGTM = (
    amount: string,
    createdAt: number,
    userId: string
  ) => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'paymentEvent',
      amount,
      createdAt,
      userId,
      eventTime: new Date().toISOString(), // 记录事件发送的时间
    })
  }

  const getOrder = useCallback(
    async (orderId: string) => {
      const { status, amount, createdAt, userId } = await getOrderInfo(orderId)
      if (status === PAY_STATUS.PROGRESS) {
        if (counter >= MAX_TRiES) {
          setStauts(PAY_STATUS.FAILURE)
          setTimeout(() => {
            router.replace('/')
          }, 5000)
          return
        } else {
          console.log('counter', counter)
          counter += 1
          setTimeout(async () => await getOrder(orderId), 3000)
          return
        }
      }
      if (status === PAY_STATUS.SUCCESS) {
        //发送事件
        sendPaymentEventToGTM(amount, createdAt, userId)
        console.log('发送支付事件：', amount, createdAt, userId)
        setStauts(PAY_STATUS.SUCCESS)
        setTimeout(() => {
          router.replace('/')
        }, 5000)
        return
      }
      if (status === PAY_STATUS.FAILURE) {
        setStauts(PAY_STATUS.FAILURE)
        setTimeout(() => {
          router.replace('/')
        }, 5000)
        return
      }
    },
    [router]
  )

  useEffect(() => {
    if (!orderId) {
      router.replace('/')
      return
    }
    getOrder(orderId)
  }, [orderId, getOrder, router]) // 添加依赖数组

  return (
    <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
      <div className="w-80 h-32 rounded-lg bg-white flex items-center justify-center text-lg font-semibold text-center">
        {status === PAY_STATUS.PROGRESS && <div>please wait for a moment!</div>}
        {status !== PAY_STATUS.PROGRESS && (
          <div>
            {status === PAY_STATUS.SUCCESS && <div>order success!</div>}
            {status === PAY_STATUS.FAILURE && <div>order failure!</div>}
            <div>navigate to home page after 5 seconds!</div>
          </div>
        )}
      </div>
    </div>
  )
}
