import { useRouter } from 'next/navigation'

interface Props {
  dialogShow: boolean
  setDialogShow: Function
}

export default function SubscribeDialog({ dialogShow, setDialogShow }: Props) {
  const router = useRouter()
  return (
    <dialog open={dialogShow} className="modal bg-transparent">
      <div className="modal-box w-[784px] max-w-[784px] p-8 rounded-3xl border-2 border-[rgba(255,255,255,0.16)] bg-center bg-cover relative"
        style={{ backgroundImage: 'url(../assets/becomePremiumDialogBg.png)' }}>
        <div onClick={() => setDialogShow(false)} className="w-14 h-14 bg-center bg-contain bg-no-repeat absolute top-0 right-0 hover:cursor-pointer"
          style={{ backgroundImage: "url(/assets/close.png)" }}
        ></div>
        <div className="text-white flex items-center">
          <div className="w-[336px] h-[448px] bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: 'url(https://cdn.candy.ai/12-908d871b-57da-4c96-a4f5-c05341873b42)' }}
          ></div>
          <div className="ml-8">
            <div className="text-3xl text-white">Upgrade To Unlock</div>
            <div className="mt-2 text-3xl text-[#ED5088]">Unlimited Messages</div>
            <div className="mt-16 text-lg text-[rgba(255,255,255,0.64)]">With subscription you get access to:</div>
            <ul className="mt-3 space-y-3">
              <li className="text-lg flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>Unlimited text messages</span></li>
              <li className="text-lg flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>Get 100 FREE Joy Coin / month</span></li>
              <li className="text-lg flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>Fast response time</span></li>
              <li className="text-lg flex items-center space-x-2"><span className='w-3 h-3 rounded-full bg-[#ED5088]'></span><span>More benefits coming soon</span></li>
            </ul>
            <div
              onClick={() => router.push('/become-premium')}
              className="mt-[50px] w-[300px] h-[50px] bg-[#ED5088] text-white rounded-lg flex items-center justify-center space-x-4 hover:cursor-pointer">
              <div className="w-6 h-6 bg-center bg-contain bg-no-repeat"
                style={{ backgroundImage: "url(/assets/subscribe.png)" }}
              ></div>
              <span>Become Premium</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
