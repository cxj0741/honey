'use client'
import { signUp } from '@/request'
import { signIn } from 'next-auth/react'
import { useRef, } from 'react'
import { z } from 'zod'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'
import { useRouter } from 'next/navigation'

const ACCOUNT = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up'
}

interface Props {
  type: typeof ACCOUNT.SIGN_IN | typeof ACCOUNT.SIGN_UP
  setType: Function
  dialogShow: boolean
  setDialogShow: Function
}
export default function LoginDialog({ type, setType, dialogShow, setDialogShow }: Props) {
  const { toast, handleToast } = useToast()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const handleConfirm = async (type: string) => {
    const email = (emailRef?.current as any)?.value?.trim() || ''
    const emailCheck = z.string().email().safeParse(email)
    if (!emailCheck.success) {
      handleToast(TOAST_TYPE.ERROR, 'email error!')
      return
    }
    const password = (passwordRef?.current as any)?.value?.trim() || ''
    const passwordCheck = z.string().min(6).safeParse(password)
    if (!passwordCheck.success) {
      handleToast(TOAST_TYPE.ERROR, 'password error!')
      return
    }

    if (type === ACCOUNT.SIGN_IN) {
      try {
        const res = await signIn('credentials', { redirect: false, email, password })
        // console.log('sign in result', res)
        if (res?.ok) {
          handleToast(TOAST_TYPE.SUCCESS, 'sign in success!')
          setDialogShow(false)
        } else {
          handleToast(TOAST_TYPE.ERROR, 'email or password error!')
        }
      } catch (error) {
        handleToast(TOAST_TYPE.ERROR, 'email or password error!')
      }
    }
    if (type === ACCOUNT.SIGN_UP) {
      try {
        const res = await signUp({ email, password })
        // console.log('sign up>>>>>', res)
        if (res.ok) {
          setDialogShow(false)
          await signIn('credentials', { email, password })
        } else {
          handleToast(TOAST_TYPE.ERROR, res.error)
        }
      } catch (error) {
        handleToast(TOAST_TYPE.ERROR, 'sign up error!')
      }
    }
  }
  const handleProviderSignIn = async () => {
    try {
      // const res = await signIn('google')
      // console.log('sign in result', res)
      await signIn('google')
      setDialogShow(false)
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'google account sign in error!')
    }
  }
  const router = useRouter()
  return (
    <div className={`${dialogShow ? 'block' : 'hidden'}`}>
      <div className="z-50 fixed left-0 top-0 w-[100vw] h-[100vh] flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
        <div className="overflow-scroll no-scrollbar p-4 rounded-3xl border border-[rgba(0,0,0,0.16)] relative flex flex-col justify-end bg-bottom bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/chatMiddleBg.png)', width: 'calc(100vw - 2rem)' }}>
          <div onClick={() => {
            setDialogShow(false)
            router.push('/')
          }} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-0 right-0 hover:cursor-pointer"
            style={{ backgroundImage: "url(/assets/close.png)" }}
          ></div>

          {/* <div className="flex-1"> */}
          <div className="my-3 space-y-4">
            <div className="text-2xl font-bold text-black">{type}</div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input ref={emailRef} type="text" className="flex-1" placeholder="Email" />
            </label>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input ref={passwordRef} type="password" className="flex-1" placeholder="Password" />
              </label>
              {
                type === ACCOUNT.SIGN_UP ?
                  <div className="mt-3 text-black">Minimum 6 characters</div>
                  :
                  <a className="inline-block mt-3 text-black underline decoration-solid">Forget Password?</a>
              }
            </div>
            {type === ACCOUNT.SIGN_UP && <button onClick={() => handleConfirm(ACCOUNT.SIGN_UP)} className="btn w-full bg-[#E75275] hover:bg-[#E75275] text-white">{ACCOUNT.SIGN_UP}</button>}
            {type === ACCOUNT.SIGN_IN && <button onClick={() => handleConfirm(ACCOUNT.SIGN_IN)} className="btn w-full bg-[#E75275] hover:bg-[#E75275] text-white">{ACCOUNT.SIGN_IN}</button>}
            <div className="flex flex-row items-center">
              <div
                className="flex-1 h-[1px]"
                style={{
                  background:
                    'linear-gradient(270deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.00) 100%)',
                }}
              ></div>
              <div className="flex-0 text-black text-sm font-medium mx-4">
                or continue with
              </div>
              <div
                className="flex-1 h-[1px]"
                style={{
                  background:
                    'linear-gradient(270deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.30) 100%)',
                }}
              ></div>
            </div>
            <div onClick={() => handleProviderSignIn()}
              className="inline-flex items-center justify-center w-full rounded-[10px] px-4 py-2.5 mb-2.5 bg-white hover:cursor-pointer"
            >
              <div className="w-6 h-6 bg-center bg-contain bg-no-repeat"
                style={{ backgroundImage: "url(/assets/google.png)" }}
              ></div>
              <div className="font-normal text-[#344054]">Google</div>
            </div>
            <div className="text-xs font-medium text-black text-center" style={{ visibility: type === ACCOUNT.SIGN_UP ? "hidden" : 'hidden' }}>
              By signing up, you agree to{' '}
              <a className="underline" href="/legal-information">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="pt-6 border-t border-[rgba(0,0,0,0.32)] font-medium text-sm text-black flex justify-center items-center">
            {type === ACCOUNT.SIGN_UP &&
              <span>
                Already have an account yet? &nbsp;
                <span onClick={() => { setType(ACCOUNT.SIGN_IN) }} className="text-[#E75275] text-sm font-semibold leading-normal cursor-pointer">
                  {ACCOUNT.SIGN_IN}
                </span>
              </span>
            }
            {type === ACCOUNT.SIGN_IN &&
              <span>
                Don&apos;t have an account yet? &nbsp;
                <span onClick={() => { setType(ACCOUNT.SIGN_UP) }} className="text-[#E75275] text-sm font-semibold leading-normal cursor-pointer">
                  {ACCOUNT.SIGN_UP}
                </span>
              </span>
            }
          </div>
          {/* </div> */}
        </div>
      </div>
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  )
}
