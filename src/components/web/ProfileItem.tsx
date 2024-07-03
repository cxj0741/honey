import Image from 'next/image'

export default function ProfileItem(props: Record<string, any>) {
  console.log(props, '<<<<<props')
  return (
    <div
      key={props.item}
      className="w-1/2 md:w-1/3 lg:w-1/4 aspect-[3/4] border-8 border-transparent relative"
    >
      <Image
        onClick={() => { }}
        className="rounded-lg object-cover"
        layout="fill"
        objectFit="cover"
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        alt={'avatar'}
      />
      <div className="absolute bottom-0 w-full p-2 text-white">
        <div className="text-xl font-bold">NAME</div>
        <div className="mt-2 text-xs">AGE</div>
        <div className="mt-2 text-sm">
          this is a description for this guy,this is a description for this
          guy,this is a description for this guy
        </div>
      </div>
    </div>
  )
}
