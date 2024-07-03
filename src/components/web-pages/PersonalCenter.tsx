'use client'
import Image from 'next/image'
// import { useState } from 'react'

function Item({ name, value }: { name: string, value: string }) {
  return (
    <>
      <div className="flex items-center space-x-1">
        <div className='text-[rgba(255,255,255,0.64)]'>{name}</div>
        <Image
          className="rounded-full"
          width={12}
          height={12}
          src="/assets/edit.png"
          alt={'avatar'}
        />
      </div>
      <div className="mt-1">{value}</div>
    </>
  )
}

const info = [
  { name: 'Nickname', value: 'Nickname' },
  { name: 'Gender', value: 'Gender' },
  { name: 'E-mail', value: 'E-mail' },
  { name: 'Password', value: 'Password' },
]

export default function PersonalCenter() {
  // const [fold, setFold] = useState(false)

  return (
    <div className="p-4 flex-1">
      <div className="w-full h-full bg-[#1F1D1F] text-white flex items-center justify-center">
        <div className="w-[1058px] h-[572px] rounded-lg border flex">
          <div className="w-1/2">
            <div className="px-8 py-6">
              <div className="text-xl text-[rgba(255,255,255,0.64)]">Basic Information</div>
              <div className="flex mt-10">
                <div className="w-[96px] h-[96px] relative">
                  <Image
                    className="rounded-full"
                    width={96}
                    height={96}
                    src="/assets/avatar.png"
                    alt={'avatar'}
                  />
                  <Image
                    className="absolute right-0 bottom-0 rounded-full"
                    width={12}
                    height={12}
                    src="/assets/edit.png"
                    alt={'avatar'}
                  />
                </div>
                <div className='ml-10 flex-1'>
                  <div className="w-full flex flex-wrap -mt-4">
                    {info.map((item) => (
                      <div className="w-1/2 mt-4" key={item.name}>
                        <Item name={item.name} value={item.value}></Item>
                      </div>
                    ))}
                  </div>
                  {/* <div className="mt-6">
                    <div className="text-[rgba(255,255,255,0.64)]">Current Plan</div>
                    <div className="mt-3 text-[#ED5088]">Annual fee</div>
                  </div> */}

                  <div className="mt-4">
                    <div className="text-[rgba(255,255,255,0.64)]">Current Plan</div>
                    <div className="mt-2 text-[#ED5088]">VIP</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className='w-1/2 text-xs'>
                        <span className='text-[rgba(255,255,255,0.64)]'>Payment date:</span>
                        <span className='text-white'>24.06.24</span>
                      </div>
                      <div className='w-1/2 text-xs'>
                        <span className='text-[rgba(255,255,255,0.64)]'>Subscription to:</span>
                        <span className='text-white'>24.06.24</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-white">
                      Extend subscription
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-6 border-t">
              <div className="pb-4 text-xl font-medium text-[rgba(255,255,255,0.64)]">Account Management</div>
              {/* <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]"> */}
              <div className="w-[10.625rem] h-8 rounded-lg border border-[rgba(255,255,255,0.32)] flex items-center justify-center space-x-2 hover:cursor-pointer">
                <Image
                  width={24}
                  height={18}
                  src="/assets/card.png"
                  alt="avatar"
                />
                <div className='text-[rgba(255,255,255,0.64)]'>
                  Delete Account
                </div>
              </div>
              <div className="mt-2 text-sm text-[rgba(255,255,255,0.64)]">
                Danger Zone：If you want to permanently delete this account and all of its data.
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="w-1/2 px-8 py-6 border-l">
            <div className="pb-4 text-xl font-medium text-[rgba(255,255,255,0.64)]">Billing Records</div>
            <div className="py-6 border-t border-[rgba(255,255,255,0.32)]">
              {
                new Array(5).fill(0).map((item, index) => (
                  <div key={index} className="h-12 flex items-center justify-center text-white">
                    <div className="w-1/5">
                      12/22
                    </div>
                    <div className="w-1/5">
                      $11.99
                    </div>
                    <div className="w-1/5">
                      Bill
                    </div>
                    <div className="w-1/5 text-[#2DBB55]">
                      Paid
                    </div>
                    <div className="w-1/5">
                      Subscription
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
