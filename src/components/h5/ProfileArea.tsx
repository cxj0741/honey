import Image from 'next/image'

// export default function ProfileItem(props: Record<string, any>) {
export default function ProfileArea() {
  return (
    <div className="border-[0.5rem] border-transparent flex flex-wrap">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <div
          key={item}
          className="w-1/2 aspect-[3/4] border-[0.5rem] border-transparent relative"
        >
          <Image
            onClick={() => { }}
            className="rounded-[0.5rem] object-cover"
            layout="fill"
            objectFit='cover'
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            alt={'avatar'}
          />
          <div className="absolute bottom-0 w-full p-2 text-white space-y-1">
            <div className="text-base font-bold">NAME</div>
            <div className="text-xs">AGE</div>
            <div className="text-xs">
              this is a description for this guy,this is a description
              for this guy,this is a description for this guy
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



