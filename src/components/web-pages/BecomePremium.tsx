'use client'
import PremiumRightPart from '@/components/web/PremiumRightPart'
import Image from 'next/image'
export default function BecomePremium() {
  return (
    <div className="m-4 flex-1 bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: 'url(../assets/becomePremiumDialogBg.png)' }}
    >
      <div className="flex">
        <div className='w-[380px] space-y-7'>
          <div className='w-full h-[84px] px-6 py-4 rounded-lg text-white bg-[#ED5088] flex space-x-3 hover:cursor-pointer'>
            <div className="">
              <div className='text-xl'>12 months</div>
              <div className='text-xs'>Annual payment billed as $71.88</div>
            </div>
            <div className="flex-1 relative">
              <div className='text-xl'>
                <span className='invisible'>12 months</span>
                <span className='absolute left-0 -top-2 block'>
                  <span className='text-3xl'>$5.99</span>
                  <span className='text-sm'>/months</span>
                </span>
              </div>
              <div className='text-xs line-through'>was $11.9/month</div>
            </div>
          </div>
          <div className="w-full h-[84px] px-6 py-4 rounded-lg border border-[#ED5088] flex items-center justify-between hover:cursor-pointer"
            style={{ background: 'linear-gradient( 135deg, #ED5088 0%, #1F1D1F 100%)' }}
          >
            <div className='text-xl text-[#ED5088]'>12 months</div>
            <div>
              <div>
                <span className='text-3xl text-[#ED5088]'>$9.99</span>
                <span className='text-sm text-white'>/months</span>
              </div>
              <div className='text-xs line-through text-[rgba(255,255,255,0.64)]'>was $11.9/month</div>
            </div>
          </div>
          <div className="w-full h-[84px] px-6 py-4 rounded-lg border border-[#ED5088] flex items-center justify-between hover:cursor-pointer"
            style={{ background: 'linear-gradient( 135deg, #ED5088 0%, #1F1D1F 100%)' }}
          >
            <div className='text-xl text-[#ED5088]'>12 months</div>
            <div>
              <span className='text-3xl text-[#ED5088]'>$9.99</span>
              <span className='text-sm text-white'>/months</span>
            </div>
          </div>
          <div className="w-full px-6 py-4 rounded-lg bg-[#ED5088] flex items-center justify-center space-x-2 hover:cursor-pointer" style={{ marginTop: '56px' }}>
            <Image
              width={24}
              height={18}
              src="/assets/card.png"
              alt="avatar"
            />
            <div className='text-white'>
              pay with creadit /debit Card
            </div>
          </div>
        </div>
        <PremiumRightPart />
      </div>
    </div>
  )
}
