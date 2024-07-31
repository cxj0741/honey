'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoginDialog from './LoginDialog'
import { ACCOUNT } from '@/utils'
// 获取session信息
import { getSession, signOut, useSession } from 'next-auth/react'
import Toast, { TOAST_TYPE, useToast } from './Toast'
import { changeUserInfo } from '@/request'

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
  const [contactDialogShow, setContactDialogShow] = useState(false)
  // 三种状态 authenticated unauthenticated loading
  const session = useSession()
  const { toast, handleToast } = useToast()
  const handleConfirmAge = async () => {
    try {
      await changeUserInfo('isAdult', true)
      handleToast(TOAST_TYPE.SUCCESS, 'confirm age success!')
      setTimeout(async () => {
        const newSession = await getSession();
        session.update(newSession)
      }, 2100)
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'confirm age failure!')
    }
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
          console.log('to new page', url)
          if (title.toLocaleLowerCase() !== 'contact us') {
            router.push(url)
          }
        }}
        className={`flex ${fold ? 'justify-center' : 'justify-start'}`}
      >
        <div
          className={`px-4 py-3 rounded-lg flex items-center space-x-4 hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer ${fold ? '' : 'flex-1'}`}
          style={{ backgroundColor: (path === `/${title.toLowerCase()}` || (path === '/' && title === 'Explore')) ? 'rgba(0,0,0,0.04)' : '' }}
        >
          <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${src})` }}></div>
          <div className={`font-medium ${fold ? 'hidden' : 'block'}`}>{title}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`bg-white ${fold ? 'w-[88px]' : 'w-[216px]'}`}>
        <div className="w-full h-full py-8 border-r border-[rgba(0,0,0,0.16)] flex flex-col">
          <div className="px-4 flex-1 flex flex-col">
            <div className="h-6 flex items-center justify-center gap-2">
              <div onClick={() => router.push('/')} className="h-6 bg-center bg-no-repeat bg-contain hover:cursor-pointer" style={{ width: fold ? 0 : '152px', backgroundImage: `url(assets/${fold ? '' : 'Honeybun'}.png)` }}></div>
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
            <div className="mt-4 text-black">
              <div
                // onClick={() => {
                //   console.log('Tawk_API CHAT>>>>>')
                //   if (typeof window.Tawk_API === 'undefined') {
                //     return
                //   }
                //   window.Tawk_API.toggle();
                // }}
                onClick={() => { setContactDialogShow(true) }}
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
                    <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}></div>
                    <div className={`flex-1 max-w-[86px] single-line-ellipsis ${fold ? 'hidden' : 'block'}`}>{session?.data?.user?.name}</div>
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

                  {/* 监听是否满足18岁 */}
                  <div className={`z-50 fixed left-0 top-0 w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.32)] flex items-center justify-center ${(session?.data?.user as any)?.isAdult ? 'hidden' : 'block'}`}>
                    <div className="relative w-80 p-8 rounded-lg bg-white">
                      <div className="text-base font-semibold text-center">Are you over 18 years old?</div>
                      <div className="mt-8 flex items-center justify-center space-x-10">
                        <button
                          onClick={() => handleConfirmAge()}
                          className="btn btn-outline btn-success btn-sm w-20">Yes</button>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="btn btn-outline btn-error btn-sm w-20">No</button>
                      </div>
                    </div>
                  </div>
                  {toast.show && <Toast type={toast.type} message={toast.message} />}
                </>
              ) : (
                <>
                  <div
                    onClick={() => {
                      setType(ACCOUNT.SIGN_IN)
                      setDialogShow(true)
                    }}
                    className="w-full h-10 rounded-lg bg-[#ED5088] text-white flex items-center justify-center hover:cursor-pointer hover:bg-[#EC1661]">
                    Login
                  </div>
                </>
              )}
          </div>
        </div>
      </div >
      <LoginDialog type={type} setType={setType} dialogShow={dialogShow} setDialogShow={setDialogShow} />
      <dialog open={contactDialogShow} className="modal bg-transparent">
        <div className="modal-box">
          <h3 className="font-bold text-lg">ATTENTION</h3>
          <p className="pt-2">contact us: support@honeybun.ai</p>
          <div className="modal-action">
            <button
              onClick={() => { setContactDialogShow(false) }}
              className="w-20 btn btn-outline btn-success btn-sm">OK</button>
          </div>
        </div>
      </dialog>
    </>
  )
}
