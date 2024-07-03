import Image from 'next/image'

interface Props {
  dialogShow: boolean
  setDialogShow: Function
}

export default function SubscribeDialog({ dialogShow, setDialogShow }: Props) {
  return (
    <dialog open={dialogShow} className="modal bg-[#1F1D1F]">
      <div className="modal-box w-[784px] h-[512px] max-w-[784px] p-8 rounded-3xl border-2 border-[rgba(255,255,255,0.16)] bg-center bg-cover relative"
        style={{ backgroundImage: 'url(../assets/becomePremiumDialogBg.png)' }}>
        <Image
          onClick={() => setDialogShow(false)}
          className='absolute top-0 right-0 hover:cursor-pointer'
          width={56}
          height={56}
          src="/assets/close.png"
          alt="avatar"
        />
        <div className="text-white flex items-center">
          {/* <div className="w-[300px] aspect-[3/4] rounded-lg"> */}
          <Image
            className="rounded-lg object-contain"
            width={336}
            height={448}
            objectFit="contain"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            alt="avatar"
          />
          {/* </div> */}
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
            <div className="mt-[50px] w-[300px] h-[50px] bg-[#ED5088] text-white rounded-lg flex items-center justify-center space-x-4 hover:cursor-pointer">
              <Image
                width={24}
                height={24}
                src="/assets/subscribe.png"
                alt="avatar"
              />
              <span>Become Premium</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
