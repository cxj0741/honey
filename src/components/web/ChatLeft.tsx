import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
interface Props {
  activeBot: Record<string, any>
  setActiveBot: Function
  currentArray: Record<string, any>[]
  setCurrentArray: Function
  timeArray: Record<string, any>[]
}

export default function ChatLeft({ activeBot, setActiveBot, currentArray, setCurrentArray, timeArray }: Props) {
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
        className="w-[312px] px-4 py-8 bg-white text-black flex flex-col"
      >
        <div className="text-2xl font-semibold">Chat</div>
        <label className="mt-4 input input-bordered input-md flex items-center gap-2 text-slate-900">
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
            className="grow"
            placeholder="Search for a profile..."
          />
        </label>
        <div className="mt-6 flex-1 space-y-4 overflow-auto no-scrollbar">
          {currentArray.filter(item => item.show).map((item) => (
            <div
              onClick={() => setActiveBot({ ...item })}
              key={item.id}
              className={`h-16 p-2 flex items-center justify-between space-x-3 rounded-lg hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer group ${activeBot.id === item.id ? 'bg-[rgba(0,0,0,0.04)]' : 'bg-transparent'}`}
            >
              <div className="w-12 h-12 rounded-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: `url(${item.image1})` }}>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <div className="flex-1 font-medium">{item.name}</div>
                  <div className="text-xs text-right">
                    {formatUnixTimestamp((timeArray.find(relation => relation.botId === item.id) as any).timestamp)}
                  </div>
                </div>
                <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
