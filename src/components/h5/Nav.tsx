'use client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function formatURL(title: string) {
  const url = `/${title.toLocaleLowerCase().split(' ').join('-')}`
  return url
}

function Item({
  src,
  title,
}: {
  src: string,
  title: string,
}) {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        let url = '/'
        if (title.toLocaleLowerCase() !== 'explore') {
          url = formatURL(title)
        }
        if (title.toLocaleLowerCase() === 'account') {
          url = '/personal-center'
        }
        console.log('to new page', url)
        router.push(url)
      }}
      className={`px-5 py-3 flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer`}
    >
      <Image width={20} height={20} src={src} alt={title} />
      <div>{title}</div>
    </div>
  )
}


export default function Nav() {
  const [fold, setFold] = useState(true)
  const [loginStatus, setLoginStatus] = useState(false)
  return (
    <>
      {/* HEADER */}
      <div className="z-50 fixed left-0 top-0 w-[100vw] pt-5 pr-4 h-16 bg-[#121112] flex items-center justify-between">
        <div className="flex items-center" onClick={() => {
          setFold(!fold)
          setLoginStatus(false)
        }}>
          <Image
            width={44}
            height={44}
            src="/h5Assets/unfold.png"
            alt={'avatar'}
          />
          <div className="text-2xl text-white">Honeybun</div>
        </div>
        {
          loginStatus ?
            <div
              // onClick={() => router.push('/become-premium')}
              className="px-2 py-0.5 rounded-lg border border-[rgba(255,255,255,0.32)] hover:cursor-pointer flex items-center justify-between"
            >
              <Image
                width={24}
                height={24}
                src="/h5Assets/token.png"
                alt={'avatar'}
              />
              <div className="text-sm text-white text-center">9999</div>
              <Image
                width={24}
                height={24}
                src="/h5Assets/plus.png"
                alt={'avatar'}
              />
            </div>
            :

            <div className="flex items-center space-x-2 text-sm">
              <div
                onClick={() => signIn('google')}
                className="w-[5rem] h-[1.75rem] px-6 py-2 border border-[#ED5088] rounded-lg text-[#ED5088] flex items-center justify-center">
                Login
              </div>
              <div className="w-[5rem] h-[1.75rem] px-6 py-2 border border-[#ED5088] bg-[#ED5088] rounded-lg text-white flex items-center justify-center">
                Register
              </div>
            </div>
        }
      </div>
      {/* LEFT NAV */}
      {!fold &&
        <div onClick={() => setFold(true)} className='z-50 fixed left-0 top-[4rem] w-[100vw] bg-[rgba(255,255,255,0.16)]'>
          <div className="pt-2 w-[12.5rem] bg-[#121112] text-white text-sm" style={{ height: 'calc(100vh - 4rem)' }}>
            <div
              onClick={() => { }}
              className={`px-4 py-3 flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer`}
            >
              <Image width={24} height={24} src="/h5Assets/avatar.png" alt={'avatar'} />
              <div>Honeybun</div>
            </div>
            <div className="h-[1px] bg-[rgba(255,255,255,0.16)]"></div>
            <Item
              src="/h5Assets/explore.png"
              title="Explore"
            />
            <Item
              src="/h5Assets/chat.png"
              title="Chat"
            />
            <Item
              src="/h5Assets/becomePremium.png"
              title="Become Premium"
            />
            <Item
              src="/h5Assets/account.png"
              title="Account"
            />
            <div className="h-[1px] bg-[rgba(255,255,255,0.16)]"></div>
            <Item
              src="/h5Assets/contactUs.png"
              title="Contact Us"
            />
            <Item
              src="/h5Assets/logout.png"
              title="Logout"
            />
          </div>

        </div>

      }
    </>
  )
}


