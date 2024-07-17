'use client'
import { useState } from 'react'
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
          console.log('to new page', url)
          if (title.toLocaleLowerCase() !== 'contact us') {
            router.push(url)
          }
        }}
        className={`flex ${fold ? 'justify-center' : 'justify-start'}`}
      >
        <div
          className={`px-4 py-3 rounded-lg flex items-center space-x-4 hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer ${fold ? '' : 'flex-1'}`}
          style={{ backgroundColor: (path === `/${title.toLowerCase()}` || (path === '/' && title === 'Explore')) ? 'rgba(0,0,0,0.04)' : 'transparent' }}
        >
          <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${src})` }}></div>
          <div className={`font-medium ${fold ? 'hidden' : 'block'}`}>{title}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={` ${fold ? 'w-[88px]' : 'w-[216px]'}`}>
        <div className="w-full h-full py-8 border-r border-[rgba(0,0,0,0.16)] flex flex-col">
          <div className="px-4 flex-1 flex flex-col">
            <div className="h-6 flex items-center justify-center gap-2">
              <div className="h-6 bg-center bg-no-repeat bg-contain" style={{ width: fold ? 0 : '152px', backgroundImage: `url(assets/${fold ? '' : 'Honeybun'}.png)` }}></div>
              <div
                onClick={() => {
                  setFold(!fold)
                }}
                className="w-6 h-6 hover:cursor-pointer bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(/assets/${fold ? 'arrowOut' : 'arrowIn'}.png)` }}></div>
            </div>
            <div className="mt-8 text-black space-y-4">
              <Item
                src={path === '/' ? '/assets/exploreSelected.png' : '/assets/explore.png'}
                title="Explore"
              />
              <Item
                src={path === '/chat' ? '/assets/chatSelected.png' : '/assets/chat.png'}
                title="Chat"
              />
              <Item
                src={path === '/premium' ? '/assets/premiumSelected.png' : '/assets/premium.png'}
                title="Premium"
              />
            </div>
            <div className="mt-[72px] text-black">
              <div onClick={() => {
                console.log('Tawk_API CHAT>>>>>')
                if (typeof window.Tawk_API === 'undefined') {
                  return
                }
                window.Tawk_API.toggle();
              }}
                className={`flex ${fold ? 'justify-center' : 'justify-start'}`}
              >
                <div className={`px-4 py-3 rounded-lg flex items-center space-x-4 hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer ${fold ? '' : 'flex-1'}`}>
                  <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/contactUs.png)' }}></div>
                  <div className={`font-medium ${fold ? 'hidden' : 'block'}`}>Contact Us</div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mb-6 h-[1px] bg-[rgba(0,0,0,0.16)]"></div> */}
          <div className="px-4 space-y-6">
            {
              // 获取到有限的session信息
              session.status === 'authenticated' ? (
                <>
                  <div className="h-[1px] bg-[rgba(0,0,0,0.16)]"></div>
                  <div onClick={() => router.push('/personal-center')}
                    className={`px-2 flex items-center space-x-4 text-black hover:cursor-pointer ${fold ? 'justify-center' : 'justify-start'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-center bg-contain bg-no-repeat bg-sky-800" style={{ backgroundImage: `url(${session?.data?.user?.image})` }}></div>
                    <div className={`flex-1 max-w-[86px] break-words ${fold ? 'hidden' : 'block'}`}>{session?.data?.user?.name}</div>
                    {/* <div className={`w-4 h-4 bg-center bg-contain bg-no-repeat ${fold ? 'hidden' : 'block'}`} style={{ backgroundImage: 'url(/assets/arrowUp.png)' }}></div> */}
                    <div onClick={event => event.stopPropagation()} className={`${fold ? 'hidden' : 'block'} dropdown dropdown-top dropdown-end`}>
                      <div tabIndex={0} role="button" className='w-4 h-4 bg-center bg-contain bg-no-repeat' style={{ backgroundImage: 'url(/assets/arrowUp.png)' }}></div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-32 p-2 shadow">
                        <li><span onClick={() => router.push('/premium')}>Subscription</span></li>
                        <li><span onClick={() => router.push('/personal-center')}>Settings</span></li>
                        <li><span onClick={() => signOut({ callbackUrl: '/' })} > Logout</span></li>
                      </ul>
                    </div>
                  </div>
                  <div
                    onClick={() => router.push('/premium')}
                    className={`p-2 rounded-lg bg-[rgba(0,0,0,0.04)] hover:cursor-pointer flex items-center justify-between ${fold ? 'flex-col space-y-2 py-4' : 'flex-row'
                      }`}
                  >
                    <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/token.png)' }}></div>
                    <div className="text-black text-center">{(session?.data?.user as any)?.tokens || 0}</div>
                    <div className="w-6 h-6 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/plus.png)' }}></div>
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
                </>
              )}
          </div>
        </div>
      </div >
      <LoginDialog type={type} setType={setType} dialogShow={dialogShow} setDialogShow={setDialogShow} />
    </>
  )
}
