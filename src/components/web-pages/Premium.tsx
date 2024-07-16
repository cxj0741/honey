'use client'
import { useState } from 'react'
export default function BecomePremium() {
  const [active, setActive] = useState(12)
  return (
    <div className='flex-1 flex flex-col'>
      <div
        className='w-full aspect-[2450/584] bg-center bg-contain bg-no-repeat'
        style={{ backgroundImage: 'url(../assets/premiumBg.png)' }}
      >
      </div>

      <div className="flex-1 flex items-center justify-center gap-8">

        <div
          onClick={() => setActive(1)}
          className={`w-[268px] h-[348px] px-4 py-5 rounded-xl border-2 hover:cursor-pointer ${active === 1 ? 'border-[#FE387F]' : 'border-[rgba(0,0,0,0.32)'}`}>
          <div className="text-xl font-semibold text-[#FE387F] text-center">1 month</div>
          <div className='mt-4 flex items-center justify-center'>
            <span className='text-3xl font-semibold text-[#FE387F]'>$11.99</span>
            <span className='text-sm text-black'>/month</span>
          </div>
          <div className='mt-2 text-xs line-through text-black text-center'>was $11.9/month</div>
          <div className='mt-10 text-sm text-center'>Annual payment billed as $11.99</div>
          <div className="mt-24 w-full py-3 rounded-lg bg-[#FE387F] flex items-center justify-center space-x-2 hover:cursor-pointer">
            <div className="w-6 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
            <div className='text-sm text-white'>
              pay with creadit /debit Card
            </div>
          </div>
        </div>

        <div
          onClick={() => setActive(12)}
          className={`w-[268px] h-[348px] px-4 py-5 rounded-xl border-2 hover:cursor-pointer ${active === 12 ? 'border-[#FE387F]' : 'border-[rgba(0,0,0,0.32)'}`}>
          <div className="text-xl font-semibold text-[#FE387F] text-center">12 months</div>
          <div className='mt-4 flex items-center justify-center'>
            <span className='text-3xl font-semibold text-[#FE387F]'>$5.99</span>
            <span className='text-sm text-black'>/month</span>
          </div>
          <div className='mt-2 text-xs line-through text-black text-center'>was $11.9/month</div>
          <div className='mt-10 text-sm text-center'>Annual payment billed as $71.88</div>
          <div className="mt-24 w-full py-3 rounded-lg bg-[#FE387F] flex items-center justify-center space-x-2 hover:cursor-pointer">
            <div className="w-6 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
            <div className='text-sm text-white'>
              pay with creadit /debit Card
            </div>
          </div>
        </div>

        <div
          onClick={() => setActive(3)}
          className={`w-[268px] h-[348px] px-4 py-5 rounded-xl border-2 hover:cursor-pointer ${active === 3 ? 'border-[#FE387F]' : 'border-[rgba(0,0,0,0.32)'}`}>
          <div className="text-xl font-semibold text-[#FE387F] text-center">3 months</div>
          <div className='mt-4 flex items-center justify-center'>
            <span className='text-3xl font-semibold text-[#FE387F]'>$9.99</span>
            <span className='text-sm text-black'>/month</span>
          </div>
          <div className='mt-2 text-xs line-through text-black text-center'>was $11.9/month</div>
          <div className='mt-10 text-sm text-center'>Annual payment billed as $29.97</div>
          <div className="mt-24 w-full py-3 rounded-lg bg-[#FE387F] flex items-center justify-center space-x-2 hover:cursor-pointer">
            <div className="w-6 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
            <div className='text-sm text-white'>
              pay with creadit /debit Card
            </div>
          </div>
        </div>

      </div>
    </div >
  )
}
