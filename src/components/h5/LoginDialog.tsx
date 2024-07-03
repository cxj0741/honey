import Image from 'next/image'

const ACCOUNT = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up'
}

interface Props {
  type: typeof ACCOUNT.SIGN_IN | typeof ACCOUNT.SIGN_UP
  setType: Function
}

export default function TypeDialog({ type, setType }: Props) {
  type = ACCOUNT.SIGN_IN

  return (
    <dialog open={false} className="modal px-6 bg-[#121112]">
      <div className="modal-box w-full h-full rounded-3xl border-2 border-[rgba(255,255,255,0.16)] bg-[#121112] relative flex flex-col justify-end"
        style={{ height: 'calc(100vh - 40vw)' }}>
        <Image
          // onClick={() => setOpen(false)}
          className='absolute top-0 right-0 hover:cursor-pointer'
          width={56}
          height={56}
          src="/assets/close.png"
          alt="avatar"
        />
        <div className="space-y-3">
          <div className="text-2xl font-bold text-white">{type}</div>
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
            <input type="text" className="grow" placeholder="Email" />
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
              <input
                type="password"
                className="grow"
                placeholder="Password"
              />
            </label>
            {
              type === ACCOUNT.SIGN_IN ?
                <div className="mt-3 text-white">Minimum 6 characters</div>
                :
                <a className="inline-block mt-3 text-white underline decoration-solid">Forget Password?</a>
            }
          </div>
          <button className="btn w-full">{type === ACCOUNT.SIGN_UP ? 'Create Account' : ACCOUNT.SIGN_IN}</button>
          <div className="flex flex-row items-center">
            <div
              className="flex-1 h-[1px]"
              style={{
                background:
                  'linear-gradient(270deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%);',
              }}
            ></div>
            <div className="flex-0 text-white text-sm font-medium mx-4">
              or continue with
            </div>
            <div
              className="flex-1 h-[1px]"
              style={{
                background:
                  'linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.30) 100%);',
              }}
            ></div>
          </div>
          <button
            name="button"
            type="submit"
            className="inline-flex items-center justify-center w-full rounded-[10px] px-4 py-2.5 mb-2.5 bg-white"
          >
            <Image
              alt="Google"
              className="h-6 w-6 mr-3"
              width={50}
              height={50}
              src="https://candy.ai/assets/google-auth-a8a364c5c399770d07ce74e6110a120970b1953557a47719692d85ea9334efb6.png"
            />
            <div className="font-normal text-[#344054]">Google</div>
          </button>
          <div className="text-xxs font-medium text-white text-center" style={{ visibility: type === ACCOUNT.SIGN_UP ? "visible" : 'hidden' }}>
            By signing up, you agree to{' '}
            <a className="underline" href="/legal-information">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="pt-6 border-t-2 font-medium text-sm text-white flex justify-center items-center">
          Already have an account yet? &nbsp;
          <span className="text-[#E75275] text-sm font-semibold leading-normal cursor-pointer">
            Sign in
          </span>
        </div>
      </div>
    </dialog>
  )
}
