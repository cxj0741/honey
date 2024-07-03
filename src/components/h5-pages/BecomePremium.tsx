'use client'
import Image from 'next/image'
export default function BecomePremium() {
  return (
    <div className="w-[100vw] px-4">
      <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.32)] bg-center bg-cover"
        style={{ backgroundImage: 'url(../assets/becomePremiumDialogBg.png)' }}>
        <div className="text-2xl text-white font-semibold">Get Exclusive</div>
        <div className="text-2xl text-[#ED5088] font-semibold">Discount Only Today！</div>
        <div className="mt-6 flex flex-col">
          <div className='space-y-4'>
            <div className='w-full h-[5.25rem] px-3 rounded-lg text-white bg-[#ED5088] flex items-center space-x-3 hover:cursor-pointer'>
              <div className="">
                <div className='font-semibold'>12 months</div>
                <div className='text-[0.625rem]'>Annual payment billed as $71.88</div>
              </div>
              <div className="flex-1 relative">
                <div className=''>
                  <span className='invisible'>12 months</span>
                  <span className='absolute left-0 -top-2 block'>
                    <span className='text-2xl font-semibold'>$5.99</span>
                    <span className='text-sm'>/months</span>
                  </span>
                </div>
                <div className='text-[0.625rem] line-through'>was $11.9/month</div>
              </div>
            </div>
            <div className="w-full h-[5.25rem] px-3 rounded-lg border border-[#ED5088] flex items-center justify-between hover:cursor-pointer"
              style={{ background: 'linear-gradient( 135deg, #ED5088 0%, #1F1D1F 100%)' }}
            >
              <div className='font-semibold text-[#ED5088]'>12 months</div>
              <div>
                <div>
                  <span className='text-2xl font-semibold text-[#ED5088]'>$9.99</span>
                  <span className='text-sm text-white'>/months</span>
                </div>
                <div className='text-[0.625rem] line-through text-[rgba(255,255,255,0.64)]'>was $11.9/month</div>
              </div>
            </div>
            <div className="w-full h-[5.25rem] px-3 rounded-lg border border-[#ED5088] flex items-center justify-between hover:cursor-pointer"
              style={{ background: 'linear-gradient( 135deg, #ED5088 0%, #1F1D1F 100%)' }}
            >
              <div className='font-semibold text-[#ED5088]'>12 months</div>
              <div>
                <span className='text-2xl font-semibold text-[#ED5088]'>$9.99</span>
                <span className='text-sm text-white'>/months</span>
              </div>
            </div>
            <div className="w-full px-8 py-3 rounded-lg bg-[#ED5088] flex items-center justify-center space-x-2 hover:cursor-pointer" style={{ marginTop: '1.5rem' }}>
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
          <div className="text-white">
            <div className="mt-6 text-xl font-semibold text-[rgba(255,255,255,0.64)]">Premium Benefits</div>
            <ul className="mt-4 space-y-4">
              <li className="text-sm flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>Unlimited text messages</span></li>
              <li className="text-sm flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>Get 100 FREE Joy Coin / month</span></li>
              <li className="text-sm flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>Fast response time</span></li>
              <li className="text-sm flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>More benefits coming soon</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
