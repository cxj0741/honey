'use client'
import { subscribe } from '@/request'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
const priceMap = {
  1: 11.99,
  3: 9.99,
  12: 5.99
}
export default function Premium() {
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
    } finally {
      setLoadingType(null)
    }
  }

  const renderPayButton = (type: 1 | 3 | 12) => {
    const isLoading = loadingType === type
    return (
      <div 
        onClick={() => !loadingType && handlePay(type)} 
        className="mt-6 w-full py-3 rounded-lg bg-[#F53276] flex items-center justify-center space-x-2 hover:cursor-pointer"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin"></div>
        ) : (
          <>
            <div className="w-6 h-4 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
            <div className='text-white'>
              Pay with Credit / Debit Card
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="w-[100vw]">
        <div className="w-[100vw] aspect-[75/32] bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/h5Assets/premium.png)' }}></div>
        <div className="px-4 py-6">
          <div className="flex gap-2">
            <div onClick={() => setActive(1)} className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 1 ? 'url(/h5Assets/oneActive.png)' : 'url(/h5Assets/one.png)' }}></div>
            <div onClick={() => setActive(12)} className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 12 ? 'url(/h5Assets/twelveActive.png)' : 'url(/h5Assets/twelve.png)' }}></div>
            <div onClick={() => setActive(3)} className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 3 ? 'url(/h5Assets/threeActive.png)' : 'url(/h5Assets/three.png)' }}></div>
          </div>
          {renderPayButton(active as 1 | 3 | 12)}
          <div className="mt-6 w-[62vw] aspect-[232/169] bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/h5Assets/premiumDesc.png)' }}></div>
        </div>
      </div >
      {/* 使用这种方式可以加快图片加载 */}
      <div className="fixed left-[100vw] top-0 w-[100vw] h-[100vh]" >
        <div className="flex gap-2">
          <div className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 1 ? 'url(/h5Assets/one.png)' : 'url(/h5Assets/oneActive.png)' }}></div>
          <div className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 12 ? 'url(/h5Assets/twelve.png)' : 'url(/h5Assets/twelveActive.png)' }}></div>
          <div className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 3 ? 'url(/h5Assets/three.png)' : 'url(/h5Assets/threeActive.png)' }}></div>
        </div>
      </div>
    </>
  )
}
