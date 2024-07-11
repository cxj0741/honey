'use client'
import PremiumRightPart from '@/components/web/PremiumRightPart'
import { useState } from 'react'
export default function BecomePremium() {
  const [active, setActive] = useState(12)
  return (
    <div className="m-4 flex-1 bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: 'url(../assets/becomePremiumDialogBg.png)' }}
    >
      <div className="flex">
        <div className='w-[380px] space-y-7'>
          <div onClick={() => setActive(12)}
            className='w-full h-[84px] px-6 py-4 rounded-lg text-white flex space-x-3 hover:cursor-pointer'
            style={{ background: active === 12 ? '#ED5088' : 'linear-gradient( 135deg, rgba(237,80,136,0.5) 0%, #1F1D1F 100%)' }}
          >
            <div className="">
              <div className={`text-xl ${active === 12 ? 'text-white' : 'text-[#ED5088]'}`}>12 months</div>
              <div className='text-xs'>Annual payment billed as $71.88</div>
            </div>
            <div className="flex-1 relative">
              <div className='text-xl'>
                <span className='invisible'>12 months</span>
                <span className='absolute left-0 -top-2 block'>
                  <span className={`text-3xl ${active === 12 ? 'text-white' : 'text-[#ED5088]'}`}>$5.99</span>
                  <span className='text-sm'>/month</span>
                </span>
              </div>
              <div className='text-xs line-through text-[rgba(255,255,255,0.64)]'>was $11.9/month</div>
            </div>
          </div>
          <div onClick={() => setActive(3)}
            className="w-full h-[84px] px-6 py-4 rounded-lg border border-[#ED5088] flex items-center justify-between hover:cursor-pointer"
            style={{ background: active === 3 ? '#ED5088' : 'linear-gradient( 135deg, rgba(237,80,136,0.5) 0%, #1F1D1F 100%)' }}
          >
            <div className={`text-xl ${active === 3 ? 'text-white' : 'text-[#ED5088]'}`}>3 months</div>
            <div>
              <div>
                <span className={`text-3xl ${active === 3 ? 'text-white' : 'text-[#ED5088]'}`}>$9.99</span>
                <span className='text-sm text-white'>/month</span>
              </div>
              <div className='text-xs line-through text-[rgba(255,255,255,0.64)]'>was $11.9/month</div>
            </div>
          </div>
          <div onClick={() => setActive(1)}
            className="w-full h-[84px] px-6 py-4 rounded-lg border border-[#ED5088] flex items-center justify-between hover:cursor-pointer"
            style={{ background: active === 1 ? '#ED5088' : 'linear-gradient( 135deg, rgba(237,80,136,0.5) 0%, #1F1D1F 100%)' }}
          >
            <div className={`text-xl ${active === 1 ? 'text-white' : 'text-[#ED5088]'}`}>1 month</div>
            <div>
              <span className={`text-3xl ${active === 1 ? 'text-white' : 'text-[#ED5088]'}`}>$11.99</span>
              <span className='text-sm text-white'>/month</span>
            </div>
          </div>
          <div className="w-full px-6 py-4 rounded-lg bg-[#ED5088] flex items-center justify-center space-x-2 hover:cursor-pointer" style={{ marginTop: '56px' }}>
            <div className="w-6 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/card.png)' }}></div>
            <div className='text-white'>
              pay with creadit /debit Card
            </div>
          </div>
        </div>
        <PremiumRightPart />
      </div>
    </div >
  )
}
