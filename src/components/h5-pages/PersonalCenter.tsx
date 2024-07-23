'use client'
import { changeUserInfo, deleteUser, uploadAvatar } from '@/request'
import { signOut, useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from '@/components/web/ConfirmDialog'
import { z } from 'zod'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'
import { formatDate } from '@/utils/formatUnixTimestamp'

export default function PersonalCenter({ user, orderArray }: { user: Record<string, any>, orderArray: Record<string, any> }) {
  // console.log('user info', user)
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
    const [gender, setGender] = useState('Male')
    const handleConfirm = async () => {
      if (name === 'Gender') {
        setDialogShow(false)
        try {
          const res = await changeUserInfo(name.toLocaleLowerCase(), gender)
          handleToast(TOAST_TYPE.SUCCESS, res.message)
          router.refresh()
        } catch (error) {
          handleToast(TOAST_TYPE.ERROR, `change ${name.toLowerCase()} error!`)
        }
        return
      }
      const str = (inputRef?.current as any)?.value.trim() || ''
      if (!str) { return }
      if (name.toLocaleLowerCase() === 'email') {
        const emailCheck = z.string().email().safeParse(str)
        if (!emailCheck.success) {
          handleToast(TOAST_TYPE.ERROR, 'email error!')
          return
        }
      }
      if (name.toLocaleLowerCase() === 'password') {
        const passwordCheck = z.string().min(6).safeParse(str)
        if (!passwordCheck.success) {
          handleToast(TOAST_TYPE.ERROR, 'password error, minimum 6 characters!')
          return
        }
      }
      (inputRef!.current as any).value = ''
      setDialogShow(false)
      try {
        const res = await changeUserInfo(name.toLocaleLowerCase(), str)
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
        <div className="modal-box p-8 rounded-lg bg-white relative">
          <div onClick={() => setDialogShow(false)} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-0 right-0 hover:cursor-pointer"
            style={{ backgroundImage: "url(/assets/close.png)" }}
          ></div>
          <h3 className="font-bold text-black text-lg">Edit {name}</h3>
          <div className="mt-8 flex flex-col space-y-4">
            {name !== 'Gender' && <input ref={inputRef} type="text" placeholder={name} className="input input-bordered w-full text-black" />}
            {name === 'Gender' &&
              <div className="flex items-center justify-center space-x-4">
                <label onClick={() => setGender('Male')} className="space-x-2 font-semibold label cursor-pointer">
                  <span className="label-text">Male</span>
                  <input type="radio" name="gender" className="radio checked:bg-blue-500" defaultChecked />
                </label>
                <label onClick={() => setGender('Female')} className="space-x-2 font-semibold label cursor-pointer">
                  <span className="label-text">Female</span>
                  <input type="radio" name="gender" className="radio checked:bg-red-500" />
                </label>
              </div>
            }
            <button
              onClick={() => handleConfirm()}
              className="btn text-black">Confirm</button>
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
        const res = await uploadAvatar(file)
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
      <div className="w-full space-y-4 p-4">
        <div className="w-full px-6 py-4 border rounded-lg" style={{ background: user.vipLevel ? 'linear-gradient( 90deg, rgba(245,50,118,0.32) 0%, rgba(245,50,118,0.08) 100%)' : 'linear-gradient( 90deg, rgba(165,153,157,0.32) 0%, rgba(165,153,157,0.08) 100%)' }}>
          <div className="text-base font-semibold">
            Subscription status
          </div>
          {
            user.vipLevel ?
              <>
                <div className="mt-4 text-[#F53276] font-semibold text-2xl">
                  Premium Member
                </div>
                <div className="mt-1 text-xs">
                  Subscription to: {formatDate(user.vipDeadline)}
                </div>
              </>
              :
              <div className="mt-4 text-black font-semibold text-2xl">
                Free Member
              </div>
          }
          {/* <div className="mt-1 text-xs">
            20224.06.24-20224.06.24
          </div> */}
        </div>
        <div className="w-full p-6 border rounded-lg">
          <div className="text-2xl">Basic Infomation</div>
          <div className="flex items-center justify-between py-6 border-b">
            <div className="flex-1">
              <div className="text-base">Profile picture</div>
              <div className="mt-1.5 text-sm">Add a profile picture to personalize your account</div>
            </div>
            <div onClick={() => { window.document.getElementById('upload')?.click() }} className="w-16 h-16 rounded-full overflow-clip relative bg-top bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${session?.data?.user?.image})`, backgroundColor: session?.data?.user?.image ? 'transparent' : '#075985' }}
            >
              <input id="upload" accept=".jpg, .jpeg, .png, .webp" onChange={event => handleUpload(event)} type="file" className='hidden' />
              <div className="absolute left-0 bottom-0 w-full h-2/5 bg-[rgba(0,0,0,0.56)] flex items-center justify-center">
                <div className="w-5 h-4 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: 'url(/assets/camera.png)' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex-1">
              <div className="text-sm">Name</div>
              <div className="mt-1.5 text-sm">{user.name}</div>
            </div>
            <div onClick={() => { setName('Name'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex-1">
              <div className="text-sm">Gender</div>
              <div className="mt-1.5 text-sm">{user.gender || ''}</div>
            </div>
            <div onClick={() => { setName('Gender'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex-1">
              <div className="text-sm">Email</div>
              <div className="mt-1.5 text-sm">{user.email}</div>
            </div>
            <div onClick={() => { setName('Email'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex-1">
              <div className="text-sm">Password</div>
              <div className="mt-1.5 text-sm">*********</div>
            </div>
            <div onClick={() => { setName('Password'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex-1">
              <div className="text-sm">Phone Number</div>
              <div className="mt-1.5 text-sm">{user.phone || ''}</div>
            </div>
            <div onClick={() => { setName('Phone'); setDialogShow(true) }} className="w-6 h-6 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/arrowRight.png)' }}></div>
          </div>
        </div>

        <div className="w-full px-6 border rounded-lg">
          <div className="py-4 border-b">
            <div className="text-sm">Danger Zone If you want to permanently delete this account and all of its data.</div>
            <div onClick={() => { handleOpenDialog() }} className="mt-3 h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/h5Assets/deleteAccount.png)' }}></div>
          </div>
          <div className="py-7 flex items-center justify-center">
            <div onClick={() => { signOut({ callbackUrl: '/' }) }} className="w-full h-8 bg-center bg-contain bg-no-repeat hover:cursor-pointer" style={{ backgroundImage: 'url(/assets/logout.png)' }}></div>
          </div>
        </div>

        {
          orderArray.length !== 0 &&
          (<div className="w-full px-6 border rounded-lg">
            <div className="py-6 border-b">
              <div className="text-2xl font-semibold">Billing Records</div>
              {orderArray.map((item: { id: string, createdAt: string, type: string }) => (
                <div key={item.id} className="h-12 flex items-center justify-center text-white">
                  <div className="w-1/4">
                    {item.createdAt}
                  </div>
                  <div className="w-1/4">
                    {item.type}
                  </div>
                  <div className="w-1/4">
                    Bill
                  </div>
                  <div className="w-1/4 text-[#2DBB55]">
                    Paid
                  </div>
                  {/* <div className="w-1/5">
                    Subscription
                  </div> */}
                </div>
              ))}
            </div>
          </div>)
        }
      </div>
      <EditDialog />
      <ConfirmDialog title={'Are you sure you want to delete account?'} open={open} setOpen={setOpen} handleConfirm={() => handleDeleteUser()} />
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </>
  )
}
