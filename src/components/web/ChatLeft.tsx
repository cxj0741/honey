import { formatUnixTimestamp } from '@/utils/formatUnixTimestamp'
import { useRef } from 'react'
interface Props {
  activeBot: Record<string, any>
  setActiveBot: Function
  currentArray: Record<string, any>[]
  setCurrentArray: Function
  timeArray: Record<string, any>[]
}

export default function ChatLeft({ activeBot, setActiveBot, currentArray, setCurrentArray, timeArray }: Props) {
  const inputRef = useRef(null)
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
        <label className="mt-4 px-2 h-10 rounded-lg border bg-[rgba(0,0,0,0.04)] flex items-center gap-2 text-slate-900">
          <div
            onClick={() => { }}
            className="w-4 h-4 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
            style={{ backgroundImage: 'url(/assets/search.png)' }}
          ></div>
          <input
            ref={inputRef}
            onChange={(event) => handleSearch(event.target.value.trim())}
            type="text"
            className="flex-1 bg-transparent active:border-none outline-none"
            placeholder="Search for a profile"
          />
          <div
            onClick={() => {
              (inputRef as any)!.current!.value = ''
              handleSearch('')
            }}
            className="w-4 h-4 bg-center bg-contain bg-no-repeat hover:cursor-pointer"
            style={{ backgroundImage: 'url(/assets/clear.png)', visibility: (inputRef as any)?.current?.value?.trim() ? 'visible' : 'hidden' }}
          ></div>
        </label>
        <div className="mt-6 flex-1 space-y-4 overflow-auto no-scrollbar">
          {currentArray.filter(item => item.show).map((item) => (
            <div
              onClick={() => {
                // const arr = currentArray.filter(bot => bot !== item)
                // setCurrentArray([item, ...arr])
                setActiveBot({ ...item })
              }}
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
                <div className="w-[200px] h-5 single-line-ellipsis font-light text-sm">
                  {(timeArray.find(relation => relation.botId === item.id) as any).botStr}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
