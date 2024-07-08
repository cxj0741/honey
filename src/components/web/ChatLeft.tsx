import Image from 'next/image'
interface Props {
  activeId: string
  setActiveId: Function
  userBotArray: Record<string, any>[]
}
export default function ChatLeft({ activeId, setActiveId, userBotArray }: Props) {
  // function delete(id:string){
  // }
  return (
    <div
      className="ml-3 w-[340px] p-4 rounded-lg bg-cover bg-center text-white space-y-4 flex flex-col"
      style={{ backgroundImage: 'url(../../assets/chatBg.png)' }}
    >
      <div className="text-2xl">Chat</div>
      <label className="input input-bordered flex items-center gap-2 text-slate-900">
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
          type="text"
          className="grow"
          placeholder="Search for a profile..."
        />
      </label>
      <div className="grow space-y-4 overflow-auto">
        {userBotArray.map((item) => (
          <div
            onClick={() => setActiveId(item.id)}
            key={item.id}
            className={`h-16 p-2 flex items-center justify-between space-x-3 border rounded-lg hover:border-[rgba(255,255,255,0.32)] hover:cursor-pointer group ${activeId === item.id ? 'border-[rgba(255,255,255,0.32)]' : 'border-transparent'}`}
          >
            <div className="w-12 h-12 rounded-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${item.image1})` }}>
            </div>
            <div className="grow space-y-1">
              <div className="font-medium">{item.name}</div>
              <div className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                {item.description}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-right text-[rgba(255,255,255,0.32)]">
                10:36
              </div>
              <div className="flex space-x-1 invisible group-hover:visible">
                <Image
                  width={16}
                  height={16}
                  src="/assets/refresh.png"
                  alt={'avatar'}
                />
                <Image
                  onClick={() => { }}
                  // onClick={() => delete(item.id)}
                  width={16}
                  height={16}
                  src="/assets/delete.png"
                  alt={'avatar'}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
