'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import LoginDialog from './LoginDialog'
import { ACCOUNT } from '@/utils'
// 获取jwt信息
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function formatURL(title: string) {
  const url = `/${title.toLocaleLowerCase().split(' ').join('-')}`
  return url
}

export default function LeftNav() {
  const [fold, setFold] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const [type, setType] = useState(ACCOUNT.SIGN_UP)
  const [dialogShow, setDialogShow] = useState(false)
  // 三种状态 authenticated unauthenticated loading
  const session = useSession()
  console.log('session data>>>>>>', session)
  useEffect(() => {
    console.log('path>>>>>', path)
    if (path.includes('/chat')) {
      setFold(true)
    }
  }, [path])

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
          // 在跳转页面之前先检测是否有session
          // if (title.toLocaleLowerCase() !== 'explore') {
          //   if (!session || session.status !== 'authenticated') {
          //     setDialogShow(true)
          //     return
          //   }
          // }

          if (title === 'Chat') {
            setFold(true)
          } else {
            setFold(false)
          }
          let url = '/'
          if (title.toLocaleLowerCase() !== 'explore') {
            url = formatURL(title)
          }
          console.log('to new page', url)
          if (title.toLocaleLowerCase() !== 'contact us') {
            router.push(url)
          }
        }}
        className={`flex ${fold ? 'justify-center' : 'justify-start'}`}
      >
        <div
          className={`px-2 py-2 rounded-lg flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer ${fold ? '' : 'grow'
            }`}
        >
          <Image width={26} height={26} src={src} alt={title} />
          <div className={`font-medium ${fold ? 'hidden' : 'block'}`}>{title}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={fold ? 'w-[110px]' : 'w-[220px]'}>
        <div className="w-full h-full p-6 pt-3 pr-0 flex flex-col">
          <div className="h-16 flex items-center justify-between">
            <Image
              width={fold ? 50 : 150}
              height={32}
              src={`/assets/${fold ? 'HoneybunFold' : 'Honeybun'}.png`}
              alt={'avatar'}
            />
            <Image
              onClick={() => {
                setFold(!fold)
              }}
              className="hover:cursor-pointer"
              width={24}
              height={24}
              src="/assets/arrowIn.png"
              alt={'avatar'}
            />
          </div>
          <div className="mt-4 text-white space-y-4">
            <Item
              src={path === '/' ? '/assets/exploreSelected.png' : '/assets/explore.png'}
              title="Explore"
            />
            <Item
              src={path === '/chat' ? '/assets/chatSelected.png' : '/assets/chat.png'}
              title="Chat"
            />
            <Item
              src={path === '/become-premium' ? '/assets/becomePremiumSelected.png' : '/assets/becomePremium.png'}
              title="Become Premium"
            />
          </div>
          <div className="grow mt-10 text-white">
            <Item
              src="/assets/contactUs.png"
              title="Contact Us"
            />
          </div>

          <div className="pt-6 border-t border-[rgba(255,255,255,0.16)] space-y-3">
            {
              // 获取到有限的session信息
              session.status === 'authenticated' ? (
                <>
                  <div
                    onClick={() => router.push('/personal-center')}
                    className={`flex items-center space-x-4 text-white hover:cursor-pointer ${fold ? 'justify-center' : 'justify-start'
                      }`}
                  >
                    <Image
                      className="rounded-full"
                      width={40}
                      height={40}
                      src={(session?.data?.user?.image) as string}
                      alt={'avatar'}
                    />
                    <div className={`flex-1 ${fold ? 'hidden' : 'block'}`}>{session?.data?.user?.name}</div>
                    <div className={`${fold ? 'hidden' : 'block'}`}>
                      <Image
                        width={16}
                        height={16}
                        src="/assets/arrowUp.png"
                        alt={'avatar'}
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => router.push('/become-premium')}
                    className={`px-4 py-2 rounded-lg border-[rgba(255,255,255,0.32)] hover:cursor-pointer flex items-center justify-between ${fold ? 'flex-col space-y-2' : 'flex-row border'
                      }`}
                  >
                    <Image
                      width={24}
                      height={24}
                      src="/assets/token.png"
                      alt={'avatar'}
                    />
                    <div className="text-white text-center">999</div>
                    <Image
                      width={24}
                      height={24}
                      src="/assets/plus.png"
                      alt={'avatar'}
                    />
                  </div>
                  <Link
                    href='/api/auth/signout'
                    className="w-full h-10 border border-black rounded-lg text-[#ED5088] flex items-center justify-center hover:cursor-pointer">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    // onClick={() => {
                    //   setType(ACCOUNT.SIGN_IN)
                    //   setDialogShow(true)
                    // }}
                    href="/api/auth/signin"
                    className="w-full h-10 border border-[#ED5088] rounded-lg text-[#ED5088] flex items-center justify-center hover:cursor-pointer">
                    Login
                  </Link>
                  {/* <div
                    onClick={() => {
                      setType(ACCOUNT.SIGN_UP)
                      setDialogShow(true)
                    }}
                    className="w-full h-10 border border-[#ED5088] bg-[#ED5088] rounded-lg text-white flex items-center justify-center hover:cursor-pointer">
                    Register
                  </div> */}
                </>
              )}
          </div>
        </div>
      </div>
      <LoginDialog type={type} setType={setType} dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
