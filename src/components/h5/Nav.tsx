'use client'
import { ACCOUNT } from '@/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import LoginDialog from './LoginDialog'
import { getSession, signOut, useSession } from 'next-auth/react'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'
import { changeUserInfo } from '@/request'

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
      <div className="w-5 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${src})` }}></div>
      <div>{title}</div>
    </div>
  )
}

export default function Nav() {
  const [fold, setFold] = useState(true)
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
      const newSession = await getSession();
      session.update(newSession)
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'confirm age failure!')
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="z-20 fixed left-0 top-0 w-[100vw] px-4 h-12 bg-white flex items-center justify-between bg-bottom bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/navBg.png)' }}
      // <div className="z-10 fixed left-0 top-0 w-[100vw] px-4 h-12 flex items-center justify-between"
      //   style={{ background: 'linear-gradient( 180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%)' }}
      >
        <div className="flex items-center">
          {path === '/' &&
            <>
              <div className="w-8 h-8 bg-bottom bg-no-repeat bg-contain" style={{ backgroundImage: 'url(assets/star.png)' }}></div>
              <div
                onClick={() => {
                  setFold(!fold)
                }}
                className="w-6 h-6 hover:cursor-pointer bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(/assets/${fold ? 'arrowOut' : 'arrowIn'}.png)` }}>
              </div>
            </>}
          {path === '/chat' && <div className="text-2xl font-semibold">Chat</div>}
          {path === '/premium' && <div className="text-2xl font-semibold">Premium</div>}
          {path === '/personal-center' && <div className="text-2xl font-semibold">Personal Info</div>}
        </div>
        {
          session.status === 'authenticated' ?
            <>
              <div
                onClick={() => router.push('/premium')}
                className="px-2 py-0.5 rounded-lg bg-[rgba(0,0,0,0.035)] hover:cursor-pointer flex items-center space-x-4"
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
            :
            <div className="flex items-center space-x-2 text-sm">
              <div
                onClick={() => {
                  setType(ACCOUNT.SIGN_IN)
                  setDialogShow(true)
                }}
                className="w-[5rem] h-[1.75rem] px-6 py-2 border border-[#ED5088] rounded-lg text-[#ED5088] flex items-center justify-center">
                Login
              </div>
            </div>
        }
      </div>
      {/* LEFT NAV */}
      {!fold &&
        <div onClick={() => setFold(true)} className='z-40 fixed left-0 top-[3rem] w-[100vw] bg-[rgba(0,0,0,0.16)]'>
          <div className="w-[12.5rem] bg-white text-black text-sm" style={{ height: 'calc(100vh - 3rem)' }}>
            {
              session.status === 'authenticated' &&
              <div
                onClick={() => router.push('/personal-center')}
                className={`min-h-14 border-b border-[rgba(0,0,0,0.16)] px-4 py-3 flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer`}
              >
                <div className="w-6 h-6 rounded-full bg-top bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}></div>
                <div className='max-w-[33vw] single-line-ellipsis'>{session?.data?.user?.name}</div>
              </div>
            }
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
            <Item
              src={path === '/personal-center' ? '/assets/accountSelected.png' : '/assets/account.png'}
              title="Account"
            />
            <div className="h-[1px] bg-[rgba(0,0,0,0.16)]"></div>
            <div
              // onClick={() => {
              //   console.log('Tawk_API CHAT>>>>>')
              //   if (typeof window.Tawk_API === 'undefined') {
              //     return
              //   }
              //   window.Tawk_API.toggle();
              // }}
              onClick={() => { setContactDialogShow(true) }}
              className={`px-5 py-3 flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer`}
            >
              <div className="w-5 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/contactUs.png)' }}></div>
              <div>Contact Us</div>
            </div>
            {
              session.status === 'authenticated' &&
              <div
                onClick={() => signOut({ callbackUrl: '/' })}
                className={`px-5 py-3 flex items-center space-x-4 hover:bg-[rgba(255,255,255,0.08)] hover:cursor-pointer`}
              >
                <div className="w-5 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/logoutIcon.png)' }}></div>
                <div>Logout</div>
              </div>
            }
          </div>
        </div>
      }
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


