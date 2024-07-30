'use client'
import { changeUserInfo, deleteUser, uploadAvatarToCloud } from '@/request'
import { signOut, useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from '@/components/web/ConfirmDialog'
import sha256 from 'crypto-js/sha256'
import { z } from 'zod'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'

export default function PersonalCenter({ user, orderArray }: { user: Record<string, any>, orderArray: Record<string, any> }) {
  // console.log('user info', user, orderArray)
  const { toast, handleToast } = useToast()
  const handleDeleteUser = async () => {
    try {
      const res = await deleteUser()
      // console.log('res', res.message)
      handleToast(TOAST_TYPE.SUCCESS, res.message)
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      handleToast(TOAST_TYPE.ERROR, 'delete user error!')
    }
  }
  const [open, setOpen] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [name, setName] = useState('')
  const handleOpenDialog = () => {
    setOpen(true)
  }
  const router = useRouter()
  const session = useSession()
  function EditDialog() {
    const inputRef = useRef(null)
    const oldPasswordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const [gender, setGender] = useState('Male')
    const handleConfirm = async () => {
      if (name === 'Gender') {
        setDialogShow(false)
        try {
          const res = await changeUserInfo(name.toLowerCase(), gender)
          handleToast(TOAST_TYPE.SUCCESS, res.message)
          router.refresh()
        } catch (error) {
          handleToast(TOAST_TYPE.ERROR, `change ${name.toLowerCase()} error!`)
        }
        return
      }
      const str = (inputRef?.current as any)?.value.trim() || ''
      if (name === 'Email') {
        if (!str) { return }
        const emailCheck = z.string().email().safeParse(str)
        if (!emailCheck.success) {
          handleToast(TOAST_TYPE.ERROR, 'email error!')
          return
        }
      }
      if (name === 'Password') {
        if (user.hashPassword) {
          const oldPassword = (oldPasswordRef?.current as any)?.value.trim() || ''
          const hashPassword = sha256(oldPassword).toString()
          if (hashPassword !== user.hashPassword) {
            handleToast(TOAST_TYPE.ERROR, 'old password error!')
            return
          }
        }

        const passwordCheck = z.string().min(6).safeParse(str)
        if (!passwordCheck.success) {
          handleToast(TOAST_TYPE.ERROR, 'password error, minimum 6 characters!')
          return
        }

        const confirmPassword = (confirmPasswordRef?.current as any)?.value.trim() || ''
        if (confirmPassword !== str) {
          handleToast(TOAST_TYPE.ERROR, 'password and confirm password are different!')
          return
        }
      }
      (inputRef!.current as any).value = ''
      setDialogShow(false)
      try {
        const res = await changeUserInfo(name.toLowerCase(), str)
        handleToast(TOAST_TYPE.SUCCESS, res.message)
        const newSession = await getSession();
        session.update(newSession)
        router.refresh()
      } catch (error) {
        handleToast(TOAST_TYPE.ERROR, `change ${name.toLowerCase()} error!`)
      }
    }

    return (
      <dialog open={dialogShow} className="modal bg-transparent">
        {/* border border-[rgba(0,0,0,0.16)] */}
        <div className="modal-box w-[360px] p-8 rounded-lg bg-white relative">
          <div onClick={() => setDialogShow(false)} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-0 right-0 hover:cursor-pointer"
            style={{ backgroundImage: "url(/assets/close.png)" }}
          ></div>
          <h3 className="font-bold text-black text-lg">Edit {name}</h3>
          <div className="mt-4 flex flex-col space-y-8">
            {name === 'Gender' &&
              <div className="flex items-center justify-center space-x-4">
                <label onClick={() => setGender('Male')} className="space-x-2 font-semibold label cursor-pointer">
                  <span className="label-text">Male</span>
                  <input type="radio" name="gender" className="radio checked:bg-blue-500" defaultChecked={user.gender === 'Male'} />
                </label>
                <label onClick={() => setGender('Female')} className="space-x-2 font-semibold label cursor-pointer">
                  <span className="label-text">Female</span>
                  <input type="radio" name="gender" className="radio checked:bg-red-500" defaultChecked={user.gender === 'Female'} />
                </label>
              </div>
            }
            {name === 'Password' &&
              <div className="space-y-3">
                {
                  user.hashPassword &&
                  <label className="input input-bordered flex items-center gap-2 mb-8">
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
                    <input ref={oldPasswordRef} type="password" className="flex-1" placeholder="Old Password" />
                  </label>
                }
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
                  <input ref={inputRef} type="password" className="flex-1" placeholder={user.hashPassword ? 'New Password' : 'Password'} />
                </label>
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
                  <input ref={confirmPasswordRef} type="password" className="flex-1" placeholder="Confirm Password" />
                </label>
              </div>
            }
            {name !== 'Gender' && name !== 'Password' && <input ref={inputRef} type="text" placeholder={name} className="input input-bordered w-full text-black" />}
            <div
              onClick={() => handleConfirm()}
              className="w-full h-12 border rounded-lg border-[#F53276] text-[#F53276] flex items-center justify-center hover:cursor-pointer hover:bg-[#F53276] hover:text-white">
              Confirm
            </div>
          </div>
        </div>
      </dialog>
    )
  }

  const handleUpload = useCallback(async (event: any) => {
    const fileInput = event.target;
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      /**
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e!.target!.result as string;
        img.style.maxWidth = '200px'; // 调整图片预览大小
        document.body.appendChild(img);
      };
      reader.readAsDataURL(file);
      */
      // console.log('file size', file.size)
      if (file.size > 5 * 1024 * 1024) {
        handleToast(TOAST_TYPE.WARNING, 'error, please note that max image size is 5M!')
        return
      } //最大5M

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'avatar');
        // console.log('start upload form data', formData)
        const res = await uploadAvatarToCloud(formData)
        // console.log('res>>>>>>,', res)
        handleToast(TOAST_TYPE.SUCCESS, res.message)
        const newSession = await getSession();
        session.update(newSession)
      } catch (error) {
        console.error('Error uploading file:', error);
        handleToast(TOAST_TYPE.ERROR, 'upload image error!')
      }
    }
  }, [handleToast, session])

  return (
    <>
      <div className="flex-1 max-h-[100vh] overflow-y-scroll no-scrollbar">
        <div className="py-10 w-full flex justify-center">
          <div className="flex-1 max-w-[872px] min-w-[536px] space-y-8">
            <div className="text-4xl font-semibold text-left">
              <span className="text-[#F53276]">Personal</span>
              <span className="ml-4 text-black">Information</span>
            </div>
            <div className="w-full p-6 border rounded-lg" style={{ background: user.vipLevel ? 'linear-gradient( 90deg, rgba(245,50,118,0.32) 0%, rgba(245,50,118,0.08) 100%)' : 'linear-gradient( 90deg, rgba(165,153,157,0.32) 0%, rgba(165,153,157,0.08) 100%)' }}>
              <div className="text-2xl font-semibold">
                Subscription status
              </div>
              {user.vipLevel ?
                <>
                  <div className="mt-8 flex items-center">
                    <div className=" flex-1 text-[#F53276] font-semibold text-3xl">
                      Premium Member
                    </div>
                    <div onClick={() => { router.push('/premium') }} className="w-[178px] h-8 border rounded-lg border-[#F53276] text-[#F53276] text-sm flex items-center justify-center hover:cursor-pointer hover:bg-[#F53276] hover:text-white">
                      Renew your subscription
                    </div>

                  </div>
                  <div className='mt-4 text-base'>Subscription to: {user.vipDeadline}</div>
                </>
                :
                <>
                  <div className="mt-8 flex items-center">
                    <div className="flex-1 text-black font-semibold text-3xl">
                      Free Member
                    </div>
                    <div onClick={() => { router.push('/premium') }} className="w-[178px] h-8 border rounded-lg border-[#F53276] text-[#F53276] text-sm flex items-center justify-center hover:cursor-pointer hover:bg-[#F53276] hover:text-white">
                      subscription
                    </div>
                  </div>
                  <div className='mt-4 text-base'>Subscription to: --</div>
                </>
              }
            </div>
            <div className="w-full p-6 border rounded-lg">
              <div className="text-2xl font-semibold">Basic Info</div>
              <div className="flex items-center justify-between py-6 border-b">
                <div className="w-60 text-base">Profile picture</div>
                <div className="flex-1 text-base">Add a profile picture to personalize your account</div>
                <div onClick={() => { window.document.getElementById('upload')?.click() }} className="w-16 h-16 rounded-full overflow-hidden relative bg-top bg-cover bg-no-repeat hover:cursor-pointer"
                  style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}
                >
                  <input id="upload" accept=".jpg, .jpeg, .png, .webp" onChange={event => handleUpload(event)} type="file" className='hidden' />
                  <div className="absolute left-0 bottom-0 w-full h-2/5 bg-[rgba(0,0,0,0.56)] flex items-center justify-center">
                    <div className="w-5 h-4 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/camera.png)' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-6 border-b">
                <div className="w-60 text-base">Name</div>
                <div className="flex-1 text-base">{user.name}</div>
                <div onClick={() => { setName('Name'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
              </div>

              <div className="flex items-center justify-between py-6 border-b">
                <div className="w-60 text-base">Gender</div>
                <div className="flex-1 text-base">{user.gender || ''}</div>
                <div onClick={() => { setName('Gender'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
              </div>

              {/* <div className="flex items-center justify-between py-6 border-b">
                <div className="w-60 text-base">Email</div>
                <div className="flex-1 text-base">{user.email}</div>
                <div onClick={() => { setName('Email'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
              </div> */}

              <div className="flex items-center justify-between py-6 border-b border-transparent">
                <div className="w-60 text-base">Password</div>
                <div className="flex-1 text-base">*********</div>
                <div onClick={() => { setName('Password'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
              </div>

              {/* <div className="flex items-center justify-between py-6 border-b">
                <div className="w-60 text-base">Phone Number</div>
                <div className="flex-1 text-base">{user.phone || ''}</div>
                <div onClick={() => { setName('Phone'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
              </div> */}
            </div>

            <div className="w-full px-6 border rounded-lg">
              <div className="flex items-center justify-between py-7">
                <div className="flex-1 text-base">Danger Zone If you want to permanently delete this account and all of its data.</div>
                <div onClick={() => { handleOpenDialog() }} className="w-[170px] h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/deleteAccount.png)' }}></div>
              </div>
              {/* <div className="py-7 flex items-center justify-center">
                <div onClick={() => { signOut({ callbackUrl: '/' }) }} className="w-[324px] h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/logout.png)' }}></div>
              </div> */}
            </div>

            {
              orderArray.length !== 0 &&
              (<div className="w-full px-6 border rounded-lg">
                <div className="py-6 border-b">
                  <div className="text-2xl font-semibold pb-6 border-b">Billing Records</div>
                  {orderArray.map((item: { id: string, createdAt: string, type: string, status: string }) => (
                    <div key={item.id} className="h-12 flex items-center justify-center text-black text-center">
                      <div className="w-1/5">
                        {item.createdAt}
                      </div>
                      <div className="w-1/5">
                        {item.type}
                      </div>
                      <div className="w-1/5">
                        Bill
                      </div>
                      <div className={`w-1/5 ${item.status === 'success' && 'text-[#2DBB55]'} ${item.status === 'failure' && 'text-[#EC1661]'} ${item.status === 'progress' && 'text-[rgba(0,0,0,0.32)]'}`}>
                        {item.status}
                      </div>
                      <div className="w-1/5">
                        Subscription
                      </div>
                    </div>
                  ))}
                </div>
              </div>)
            }
          </div>
        </div>
      </div >
      <EditDialog />
      <ConfirmDialog title={'Are you sure you want to delete account?'} open={open} setOpen={setOpen} handleConfirm={() => handleDeleteUser()} />
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </>
  )
}
