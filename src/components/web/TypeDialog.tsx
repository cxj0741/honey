import Image from 'next/image'
// import { useState } from 'react'
export const TYPE = {
  MALE: "MALE",
  FEMALE: 'FEMALE',
  ANIME: 'ANIME'
}

type SetType = (type: typeof TYPE.MALE | typeof TYPE.FEMALE | typeof TYPE.ANIME) => void

interface Props {
  open: boolean
  setType: SetType
}

export default function TypeDialog({ open, setType }: Props) {
  return (
    <dialog open={open} className="modal bg-[#1F1D1F]">
      <div className="modal-box max-w-[30vw] min-w-[600px] px-10 py-8 bg-blue-300 rounded-3xl border-[3px] border-black-stroke">
        <div className="text-white text-center text-[50px] font-semibold leading-[30px] ">
          honeybun.ai
        </div>
        <div className="text-white text-center text-[20px] font-semibold leading-[30px] mt-6">
          I&apos;m Interested in:
        </div>
        <div className="mt-6 flex justify-between">
          <div className="w-[150px] h-[150px] relative hover:cursor-pointer">
            <Image
              onClick={() => setType(TYPE.MALE)}
              className="rounded-3xl"
              width={150}
              height={150}
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt={'avatar'}
            />
            <div className="text-white absolute" style={{ left: '50%', bottom: '8px', transform: 'translateX(-50%)' }}>GIRLS</div>
          </div>
          <div className="w-[150px] h-[150px] relative hover:cursor-pointer">
            <Image
              onClick={() => setType(TYPE.FEMALE)}
              className="rounded-3xl"
              width={150}
              height={150}
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt={'avatar'}
            />
            <div className="text-white absolute" style={{ left: '50%', bottom: '8px', transform: 'translateX(-50%)' }}>Guys</div>
          </div>
          <div className="w-[150px] h-[150px] relative hover:cursor-pointer">
            <Image
              onClick={() => setType(TYPE.ANIME)}
              className="rounded-3xl"
              width={150}
              height={150}
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt={'avatar'}
            />
            <div className="text-white absolute" style={{ left: '50%', bottom: '8px', transform: 'translateX(-50%)' }}>Anime</div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
