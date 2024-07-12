'use client'
import { changeUserInfo, deleteUser } from '@/request'
import { signOut, useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import ConfirmDialog from '@/components/web/ConfirmDialog'

function Item({ name, value }: { name: string, value: string }) {
  return (
    <>
      <div className="flex items-center space-x-1">
        <div className='text-[rgba(255,255,255,0.64)]'>{name}</div>
        <div className="w-3 h-3 rounded-full bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/edit.png)' }}></div>
      </div>
      <div className="mt-3 text-white text-sm break-words">{value}</div>
    </>
  )
}

const info = [
  { name: 'Name', value: 'name' },
  { name: 'Email', value: 'email' },
  { name: 'Password', value: 'password' },
  // { name: 'Tokens', value: 'tokens' },
]

export default function PersonalCenter({ user, orderArray }: { user: Record<string, any>, orderArray: Record<string, any> }) {
  const handleDeleteUser = async () => {
    try {
      await deleteUser()
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      // await
      console.log('error', error)
    }
  }
  const [open, setOpen] = useState(false)
  const [dialogShow, setDialogShow] = useState(false)
  const [name, setName] = useState('')
  const handleOpenDialog = () => {
    setOpen(true)
  }

  function EditDialog() {
    const session = useSession()
    // console.log('session>>>>', session)
    const router = useRouter()
    const inputRef = useRef(null)
    const handleConfirm = async () => {
      const str = (inputRef?.current as any)?.value.trim() || ''
      if (!str) { return }
      setDialogShow(false);
      (inputRef!.current as any).value = ''
      await changeUserInfo(name.toLocaleLowerCase(), str)
      const newSession = await getSession();
      session.update(newSession)
      router.push('/personal-center')
    }
    return (
      <dialog open={dialogShow} className="modal bg-transparent">
        <div className="modal-box w-[360px] p-8 rounded-3xl border-2 border-[rgba(255,255,255,0.16)] bg-[#1F1D1F] relative">
          <div onClick={() => setDialogShow(false)} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-0 right-0 hover:cursor-pointer"
            style={{ backgroundImage: "url(/assets/close.png)" }}
          ></div>
          <h3 className="font-bold text-white text-lg">Edit {name}</h3>
          <div className="mt-8 flex flex-col space-y-4">
            <input ref={inputRef} type="text" placeholder={name} className="input input-bordered w-full text-black" />
            <button
              onClick={() => handleConfirm()}
              className="btn btn-outline  text-white">Confirm</button>
          </div>
        </div>
      </dialog>
    )
  }

  return (
    <>
      <div className='fixed top-16 left-0 w-[100vw] h-[0.5px] bg-[rgba(255,255,255,0.32)]'></div>
      <div className='px-4 pb-4'>
        <div className="py-4 text-xl font-medium text-center text-[rgba(255,255,255,0.64)]">Basic Information</div>
        <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]">
          <div className="flex justify-center">
            <div className="w-[5rem] h-[5rem] relative"
              onClick={() => {
                setName('Avatar')
                setDialogShow(true)
              }}>
              <div className="w-20 h-20 rounded-full bg-center bg-no-repeat bg-contain bg-sky-800" style={{ backgroundImage: `url(${user.image || ''})` }}></div>
              <div className="absolute right-0 bottom-0 rounded-full w-3 h-3 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/edit.png)' }}></div>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full flex flex-wrap -mt-6">
              {info.map((item) => (
                <div onClick={() => {
                  setName(item.name)
                  setDialogShow(true)
                }}
                  className="w-1/2 mt-6 hover:cursor-pointer" key={item.name}>
                  <Item name={item.name} value={item.name === 'Password' ? '*********' : user[item.name.toLowerCase()]}></Item>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-[rgba(255,255,255,0.64)]">Current Plan</div>
            <div className="mt-3 text-[#ED5088]">VIP</div>
            <div className="mt-2 flex items-center justify-between">
              <div className='w-1/2 text-xs'>
                <span className='text-[rgba(255,255,255,0.64)]'>Payment date:</span>
                <span className='text-white'>24.06.24</span>
              </div>
              <div className='w-1/2 text-xs'>
                <span className='text-[rgba(255,255,255,0.64)]'>Subscription to:</span>
                <span className='text-white'>24.06.24</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-white">
              Extend subscription
            </div>
          </div>
        </div>
        {orderArray.length &&
          <>
            <div className="py-4 text-xl font-medium text-center text-[rgba(255,255,255,0.64)]">Billing Records</div>
            <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]">
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
                  <div className="w-1/4">
                    Subscription
                  </div>
                </div>
              ))}
            </div>
          </>
        }
        <div className="py-4 text-xl font-medium text-center text-[rgba(255,255,255,0.64)]">Account Management</div>
        <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.32)]">
          <div onClick={() => { handleOpenDialog() }} className="w-[10.625rem] h-8 rounded-lg border border-[rgba(255,255,255,0.32)] flex items-center justify-center space-x-2 hover:cursor-pointer">
            <div className="w-6 h-5 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/delete.png)' }}></div>
            <div className='text-[rgba(255,255,255,0.64)]'>
              Delete Account
            </div>
          </div>
          <div className="mt-2 text-xs text-[rgba(255,255,255,0.64)]">
            Danger Zone：If you want to permanently delete this account and all of its data.
          </div>
        </div>
      </div>
      <EditDialog />
      <ConfirmDialog title={'Are you sure you want to delete account?'} open={open} setOpen={setOpen} handleConfirm={async () => await handleDeleteUser()} />
    </>
  )
}
