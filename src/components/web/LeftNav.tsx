'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoginDialog from './LoginDialog'
import { ACCOUNT } from '@/utils'
// 获取session信息
import { signOut, useSession } from 'next-auth/react'

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
  // console.log('session data>>>>>>', session)
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
          if (title === 'Chat') {
            setFold(true)
          }
          // else {
          //   setFold(false)
          // }
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
          className={`px-2 py-2 rounded-lg flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer ${fold ? '' : 'flex-1'}`}
        >
          <div className="w-7 h-7 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${src})` }}></div>
          <div className={`font-medium ${fold ? 'hidden' : 'block'}`}>{title}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={` ${fold ? 'w-[90px]' : 'w-[240px]'}`}>
        <div className="w-full h-full py-3 border-r border-[#363636] flex flex-col">
          <div className="px-3 flex-1 flex flex-col">
            <div className="h-16 flex items-center justify-center">
              <div className="h-8 bg-center bg-no-repeat bg-contain" style={{ width: fold ? 0 : '150px', backgroundImage: `url(assets/${fold ? '' : 'Honeybun'}.png)` }}></div>
              <div
                onClick={() => {
                  setFold(!fold)
                }}
                className="w-6 h-6 hover:cursor-pointer bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(/assets/${fold ? 'arrowOut' : 'arrowIn'}.png)` }}></div>
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
            <div className="mt-10 text-white">
              <Item
                src="/assets/contactUs.png"
                title="Contact Us"
              />
            </div>
          </div>
          <div className="pt-6 border-t border-[rgba(255,255,255,0.16)]">
            <div className="px-3 space-y-3">
              {
                // 获取到有限的session信息
                session.status === 'authenticated' ? (
                  <>
                    <div onClick={() => router.push('/personal-center')}
                      className={`flex items-center space-x-4 text-white hover:cursor-pointer ${fold ? 'justify-center' : 'justify-start'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-center bg-contain bg-no-repeat bg-sky-800" style={{ backgroundImage: `url(${session?.data?.user?.image})` }}></div>
                      <div className={`flex-1 ${fold ? 'hidden' : 'block'}`}>{session?.data?.user?.name}</div>
                    </div>
                    <div
                      onClick={() => router.push('/become-premium')}
                      className={`px-4 py-2 rounded-lg border-[rgba(255,255,255,0.32)] hover:cursor-pointer flex items-center justify-between ${fold ? 'flex-col space-y-2' : 'flex-row border'
                        }`}
                    >
                      <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/token.png)' }}></div>
                      <div className="text-white text-center">999</div>
                      <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/plus.png)' }}></div>
                    </div>
                    <div
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full h-10 border border-transparent rounded-lg text-[#ED5088] flex items-center justify-center hover:cursor-pointer">
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        setType(ACCOUNT.SIGN_IN)
                        setDialogShow(true)
                      }}
                      className="w-full h-10 border border-[#ED5088] rounded-lg text-[#ED5088] flex items-center justify-center hover:cursor-pointer">
                      Login
                    </div>
                    <div
                      onClick={() => {
                        setType(ACCOUNT.SIGN_UP)
                        setDialogShow(true)
                      }}
                      className="w-full h-10 border border-[#ED5088] bg-[#ED5088] rounded-lg text-white flex items-center justify-center hover:cursor-pointer">
                      Register
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div >
      <LoginDialog type={type} setType={setType} dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
