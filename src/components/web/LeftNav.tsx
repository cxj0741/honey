'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoginDialog from './LoginDialog'
import { ACCOUNT } from '@/utils'
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
  const session = useSession()
  const { toast, handleToast } = useToast()
  const hasSentToGTM = useRef(false) // 用于跟踪是否已经发送过事件

  // 发送数据到 GTM
  const sendToGTM =  (userId: string | null | undefined, name: string | null| undefined, gender: string | null| undefined, loginMethod: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'userLogin',
      userId,
      name,
      gender,
      loginMethod,
      loginTime: new Date().toISOString()
    });
  };

  useEffect(() => {
    const localStorageFlag = localStorage.getItem('hasSentToGTM');
    if (!localStorageFlag && session.status === 'authenticated' && session.data?.user && !hasSentToGTM.current) {
      const { id, name, gender, email } = session.data.user;
      const loginMethod = (email === name) ? "password" : "thirdParty";
      sendToGTM(id, name, gender, loginMethod);
      localStorage.setItem('hasSentToGTM', 'true');
      hasSentToGTM.current = true;
    }
  }, [session.status, session.data]);
  


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
        className={`flex relative group ${fold ? 'justify-center' : 'justify-start'}`}
      >
        <div
          className={`px-4 py-3 rounded-lg flex items-center space-x-4 hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer ${fold ? '' : 'flex-1'}`}
          style={{ backgroundColor: (path === `/${title.toLowerCase()}` || (path === '/' && title === 'Explore')) ? 'rgba(0,0,0,0.04)' : '' }}
        >
          <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${src})` }}></div>
          <div className={`font-medium ${fold ? 'hidden' : 'block'}`}>{title}</div>
        </div>
        {fold && (
         <div className="absolute left-full ml-2 py-1 px-2 bg-gray-100 text-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
          {title}
        </div>
      )}
      </div>
    )
  }

  return (
    <>
      <div 
        className={`bg-white transition-all duration-300 ease-in-out ${fold ? 'w-[88px]' : 'w-[216px]'}`}
      >
        <div className="w-full h-full py-8 border-r border-[rgba(0,0,0,0.16)] flex flex-col">
          <div className="px-4 flex-1 flex flex-col">
            <div className="h-6 flex items-center justify-center gap-2">
              <div 
                onClick={() => router.push('/')} 
                className="h-6 bg-center bg-no-repeat bg-contain hover:cursor-pointer transition-all duration-300 ease-in-out" 
                style={{ 
                  width: fold ? '0px' : '152px', 
                  backgroundImage: `url(assets/${fold ? '' : 'Honeybun'}.png)`,
                  transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
                  opacity: fold ? 0 : 1
                }}
              ></div>
              <div
                onClick={() => {
                  setFold(!fold)
                }}
                className="w-6 h-6 hover:cursor-pointer bg-center bg-no-repeat bg-contain transition-all duration-300 ease-in-out" 
                style={{ 
                  backgroundImage: `url(/assets/${fold ? 'arrowOut' : 'arrowIn'}.png)`,
                  transform: fold ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              ></div>
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
              onClick={() => { setContactDialogShow(true) }}
              className={`flex relative group ${fold ? 'justify-center' : 'justify-start'}`}
            >
              <div className={`px-4 py-3 rounded-lg flex items-center space-x-4 hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer ${fold ? '' : 'flex-1'}`}>
                <div className="w-6 h-6 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/contactUs.png)' }}></div>
                <div className={`font-medium ${fold ? 'hidden' : 'block'} overflow-hidden whitespace-nowrap text-ellipsis`}>Contact Us</div>
              </div>
              {fold && (
                <div className="absolute left-full ml-2 py-1 px-2 bg-gray-100 text-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
                  Contact Us
                </div>
              )}
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
                    className={`p-2 rounded-lg flex items-center space-x-4 text-black hover:cursor-pointer hover:bg-[rgba(0,0,0,0.04)] ${fold ? 'justify-center' : 'justify-start'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}></div>
                    <div className={`flex-1 max-w-[86px] single-line-ellipsis ${fold ? 'hidden' : 'block'}`}>{session?.data?.user?.name}</div>
                    {/* <div className={`w-4 h-4 bg-center bg-contain bg-no-repeat ${fold ? 'hidden' : 'block'}`} style={{ backgroundImage: 'url(/assets/arrowUp.png)' }}></div> */}
                    <details onClick={event => event.stopPropagation()} className={`${fold ? 'hidden' : 'block'} dropdown dropdown-top dropdown-end`}>
                      <summary className='p-2 rounded-lg hover:bg-[rgba(0,0,0,0.08)] flex items-center justify-center'>
                        <div className="w-4 h-4 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/arrowUp.png)' }}></div>
                      </summary>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-32 p-2 shadow">
                        <li><span onClick={() => router.push('/premium')}>Subscription</span></li>
                        <li><span onClick={() => router.push('/personal-center')}>Settings</span></li>
                        <li><span onClick={() => signOut({ callbackUrl: '/' })} > Logout</span></li>
                      </ul>
                    </details>
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
                  <div className={`${(session?.data?.user as any)?.isAdult ? 'hidden' : 'block'}`}>
                    <div className={`z-50 fixed left-0 top-0 w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.32)] flex items-center justify-center`} >
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
                  </div>
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
