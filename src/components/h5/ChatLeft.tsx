import { deleteBotDialogs, deleteUserBot } from '@/request'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/web/ConfirmDialog'
import { useState } from 'react'
import { CHAT_PART } from '@/components/h5-pages/Chat'
import { emitter, FOOTER_NAV_EVENT } from '@/utils'
import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import Toast, { TOAST_TYPE, useToast } from '@/components/web/Toast'

interface Props {
  setPart: Function
  activeBot: Record<string, any>
  setActiveBot: Function
  currentArray: Record<string, any>[]
  setCurrentArray: Function
  timeArray: Record<string, any>[]
}
export default function ChatLeft({ setPart, activeBot, setActiveBot, currentArray, setCurrentArray, timeArray }: Props) {
  const { toast, handleToast } = useToast()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('')
  const [title, setTitle] = useState('')
  const handleOpenDialog = (str: string) => {
    if (str === 'REFRESH') {
      setTitle('Are you sure you want to refresh dialogs?')
    }
    if (str === 'DELETE') {
      setTitle('Are you sure you want to delete bot?')
    }
    setAction(str)
    setOpen(true)
  }
  const handleConfirm = async () => {
    setOpen(false)
    if (action === 'REFRESH') {
      try {
        const res = await deleteBotDialogs(activeBot.id)
        handleToast(TOAST_TYPE.SUCCESS, res.message)
        setActiveBot({ ...activeBot })
      } catch (error) {
        handleToast(TOAST_TYPE.ERROR, 'delete dialogs error!')
      }
    }
    if (action === 'DELETE') {
      try {
        const res = await deleteUserBot(activeBot.id)
        handleToast(TOAST_TYPE.SUCCESS, res.message)
        const array = currentArray.filter(item => item.id !== activeBot.id)
        if (!array.length) {
          router.push('/')
        }
        setCurrentArray(array)
        setActiveBot({ ...array[0] })
      } catch (error) {
        handleToast(TOAST_TYPE.ERROR, 'delete bot error!')
      }
    }
    setAction('')
    setTitle('')
  }
  const handleSearch = (str: string) => {
    const arr = currentArray.map(item => {
      if (item.name.toLowerCase().includes(str.toLowerCase())) {
        item.show = true
      } else {
        item.show = false
      }
      return item
    })
    setCurrentArray(arr)
  }

  return (
    <>
      <div
        className="w-[100vw] p-4 bg-cover bg-center text-black space-y-6 flex flex-col"
        style={{height: 'calc(100vh - 7.5rem)'}}
      >
        <div className="flex items-center justify-between">
          <label className="flex-1 input input-bordered flex items-center gap-2 text-slate-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              onChange={(event) => handleSearch(event.target.value.trim())}
              type="text"
              className="flex-1"
              placeholder="Search for a profile..."
            />
          </label>
        </div>
        <div className="grow space-y-4 overflow-auto no-scrollbar">
          {currentArray.filter(item => item.show).map((item) => (
            <div key={item.id} className='mt-2 pb-2 overflow-x-auto no-scrollbar'>
              <div className='flex items-center'>
                <div
                  onClick={() => {
                    emitter.emit(FOOTER_NAV_EVENT, false)
                    setPart(CHAT_PART.MIDDLE)
                    setActiveBot({ ...item })
                  }}
                  className="h-12 flex items-center justify-between space-x-3"
                  style={{ width: '100vw' }}
                >
                  <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${item.image1})` }}></div>
                  <div className="grow space-y-2">
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="w-[60vw] text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.description}
                    </div>
                  </div>
                  <div className="space-y-3 flex flex-col items-end">
                    <div className="text-xs text-[rgba(0,0,0,0.64)]">
                      {formatUnixTimestamp((timeArray.find(relation => relation.botId === item.id) as any).timestamp)}
                    </div>
                    <div
                      className="w-3 h-3"
                    ></div>
                  </div>
                </div>
                <div className="mx-6 h-12 space-x-4 flex items-center">
                  <div
                    onClick={() => { handleOpenDialog('REFRESH') }}
                    className="w-6 h-6 bg-center bg-contain bg-no-repeat"
                    style={{ backgroundImage: "url(/assets/refresh.png)" }}
                  ></div>
                  <div
                    onClick={() => { handleOpenDialog('DELETE') }}
                    className="w-6 h-6 bg-center bg-contain bg-no-repeat"
                    style={{ backgroundImage: "url(/assets/delete.png)" }}
                  ></div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog title={title} open={open} setOpen={setOpen} handleConfirm={() => handleConfirm()} />
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </>
  )
}
