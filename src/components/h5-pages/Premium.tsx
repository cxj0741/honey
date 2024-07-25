'use client'
import { useState } from 'react'
export default function Premium() {
  const [active, setActive] = useState(12)
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
          <div className="mt-6 w-full py-3 rounded-lg bg-[#F53276] flex items-center justify-center space-x-2 hover:cursor-pointer">
            <div className="w-6 h-4 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
            <div className='text-white'>
              pay with creadit /debit Card
            </div>
          </div>
          <div className="mt-6 w-[62vw] aspect-[232/169] bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/h5Assets/premiumDesc.png)' }}></div>
        </div>
      </div>
      {/* 使用这种方式可以加快图片加载 */}
      <div className="fixed left-[100vw] top-0 w-[100vw] h-[100vh]">
        <div className="flex gap-2">
          <div className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 1 ? 'url(/h5Assets/one.png)' : 'url(/h5Assets/oneActive.png)' }}></div>
          <div className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 12 ? 'url(/h5Assets/twelve.png)' : 'url(/h5Assets/twelveActive.png)' }}></div>
          <div className="flex-1 aspect-[109/162] bg-center bg-contain bg-no-repeat" style={{ backgroundImage: active === 3 ? 'url(/h5Assets/three.png)' : 'url(/h5Assets/threeActive.png)' }}></div>
        </div>
      </div>
    </>
  )
}
