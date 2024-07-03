'use client'
import Image from 'next/image'
import { useState } from 'react'

function Item({ name, value, setName }: { name: string, value: string, setName: Function }) {
  return (
    <>
      <div className="flex items-center space-x-1" onClick={() => {
        setName(name)
      }}>
        <div className='text-[rgba(255,255,255,0.64)]'>{name}</div>
        <Image
          className="rounded-full"
          width={12}
          height={12}
          src="/assets/edit.png"
          alt={'avatar'}
        />
      </div>
      <div className="mt-3 text-white">{value}</div>
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
  const [name, setName] = useState('')

  function EditDialog() {
    return (
      // <dialog open={name !== ''} className="modal px-4 bg-[#1F1D1F]">
      <dialog open={name !== ''} className="modal px-4 bg-transparent">
        <div className="modal-box w-full h-[12rem] p-4 rounded-3xl border-2 border-[rgba(255,255,255,0.16)] bg-black relative flex flex-col">
          <Image
            onClick={() => setName('')}
            className='absolute top-0 right-0 hover:cursor-pointer'
            width={56}
            height={56}
            src="/assets/close.png"
            alt="avatar"
          />
          <div className="text-white">Edit {name}</div>
          <input type="text" placeholder="Type here" className="mt-3 input input-bordered w-full" />
          <div className="mt-6 h-12 rounded-lg bg-[#ED5088] text-white text-sm font-medium flex justify-center items-center">Save Changes</div>
        </div>
      </dialog>
    )
  }
  
  return (
    <>
      <div className='fixed top-16 left-0 w-[100vw] h-[0.5px] bg-[rgba(255,255,255,0.32)]'></div>
      <div className='px-4 pb-4'>
        <div className="py-4 text-xl font-medium text-center text-[rgba(255,255,255,0.64)]">Basic Information</div>
        <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]">
          <div className="flex justify-center">
            <div className="w-[5rem] h-[5rem] relative" onClick={() => setName('Avatar')}>
              <Image
                className="rounded-full"
                width={80}
                height={80}
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
          </div>
          <div className="mt-6">
            <div className="w-full flex flex-wrap -mt-6">
              {info.map((item) => (
                <div className="w-1/2 mt-6" key={item.name}>
                  <Item name={item.name} value={item.value} setName={setName}></Item>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-[rgba(255,255,255,0.64)]">Current Plan</div>
            <div className="mt-3 text-[#ED5088]">VIP</div>
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

        <div className="py-4 text-xl font-medium text-center text-[rgba(255,255,255,0.64)]">Billing Records</div>
        <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]">
          {
            new Array(5).fill(0).map((item, index) => (
              <div key={index} className="h-12 flex items-center justify-center text-white">
                <div className="w-1/4">
                  12/22
                </div>
                <div className="w-1/4">
                  $11.99
                </div>
                <div className="w-1/4">
                  Bill
                </div>
                <div className="w-1/4 text-[#2DBB55]">
                  Paid
                </div>
              </div>
            ))
          }
        </div>

        <div className="py-4 text-xl font-medium text-center text-[rgba(255,255,255,0.64)]">Account Management</div>
        <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]">
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
          <div className="mt-2 text-xs text-[rgba(255,255,255,0.64)]">
            Danger Zone：If you want to permanently delete this account and all of its data.
          </div>
        </div>
      </div>
      <EditDialog />
    </>
  )
}
