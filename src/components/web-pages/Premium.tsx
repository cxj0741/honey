'use client'
import { subscribe } from '@/request'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
const priceMap = {
  1: 11.99,
  3: 9.99,
  12: 5.99
}
export default function BecomePremium() {
  const [active, setActive] = useState(12)
  const [loadingType, setLoadingType] = useState<1 | 3 | 12 | null>(null)
  const session = useSession()

  const handlePay = async (type: 1 | 3 | 12) => {
    setLoadingType(type)
    try {
      const res = await subscribe((session.data?.user as any)?.email, type * (priceMap[type]))
      window.location.href = res.checkout_url
    } catch (error) {
      console.error('Payment error:', error)
      // 这里可以添加错误处理，比如显示错误消息给用户
    } finally {
      setLoadingType(null)
    }
  }

  const PayButton = ({ type }: { type: 1 | 3 | 12 }) => (
    <div 
      onClick={() => handlePay(type)} 
      className="mt-24 w-full py-3 rounded-lg bg-[#FE387F] flex items-center justify-center space-x-2 hover:cursor-pointer hover:bg-[#EC1661]"
    >
      {loadingType === type ? (
        <span className="loading loading-spinner loading-sm text-white"></span>
      ) : (
        <>
          <div className="w-6 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
          <div className='text-sm text-white'>
            Pay with Credit / Debit Card
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className='flex-1 flex flex-col'>
      <div
        className='w-full aspect-[2450/584] bg-center bg-contain bg-no-repeat'
        style={{ backgroundImage: 'url(../assets/premiumBg.png)' }}
      >
      </div>

      <div className="flex-1 flex items-center justify-center gap-8 bg-white">
        {[1, 12, 3].map((months) => (
          <div
            key={months}
            onClick={() => setActive(months)}
            className={`w-[268px] h-[348px] px-4 py-5 rounded-xl border-2 hover:cursor-pointer hover:border-[#FE387F] transition-all duration-300 ease-in-out hover:bg-pink-50 hover:scale-105 ${active === months ? 'border-[#FE387F]' : 'border-[rgba(0,0,0,0.32)'}`}>
            <div className="text-xl font-semibold text-[#FE387F] text-center">{months === 1 ? '1 month' : months === 12 ? '12 months' : '3 months'}</div>
            <div className='mt-4 flex items-center justify-center'>
              <span className='text-3xl font-semibold text-[#FE387F]'>{priceMap[months as keyof typeof priceMap]}</span>
              <span className='text-sm text-black'>{months === 1 ? '/month' : months === 12 ? '/month' : '/month'}</span>
            </div>
            <div className='mt-2 text-xs line-through text-black text-center'>{months === 1 ? 'was $11.9/month' : months === 12 ? 'was $11.9/month' : 'was $11.9/month'}</div>
            <div className='mt-10 text-sm text-center'>{months === 1 ? 'Total price $11.99' : months === 12 ? 'Annual payment billed as $71.88' : 'Quarterly payment billed as $29.97'}</div>
            <PayButton type={months as 1 | 3 | 12} />
          </div>
        ))}
      </div>
    </div >
  )
}