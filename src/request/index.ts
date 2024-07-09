let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000'
  // baseURL = 'http://192.168.10.76:3000'
  
} else {
  baseURL = 'https://honeybun.vercel.app'
}

export const TYPE = {
  MALE: 'guys',
  FEMALE: 'girls',
  ANIME: 'anime',
}

export async function getBots(type: string) {
  const res = await fetch(`${baseURL}/api/bots?type=${type}`)
  // console.log('res>>>>>', res)
  const data = await res.json()
  // console.log('data>>>', data)
  return data
}

export async function getBotDetail(id: string) {
  const res = await fetch(`${baseURL}/api/botDetail?id=${id}`)
  const data = await res.json()
  return data
}

export async function getUserToBotDetail(id: string) {
  const res = await fetch(`${baseURL}/api/getUserToBotDetail?id=${id}`)
  const data = await res.json()
  return data
}

export async function deleteUserBot(id: string) {
  console.log('deleteUserBot', id)
  const res = await fetch(`${baseURL}/api/deleteUserBot?id=${id}`)
  const data = await res.json()
  return data
}

export async function deleteBotDialogs(id: string) {
  console.log('deleteDialogs', id)
  const res = await fetch(`${baseURL}/api/deleteBotDialogs?id=${id}`)
  const data = await res.json()
  return data
}

export async function getDialogs(botId: string) {
  const res = await fetch(`${baseURL}/api/getDialogs?id=${botId}`)
  const data = await res.json()
  // console.log('getDialogs>>>>>>>>>> data', data)
  return data
}

export async function saveDialog(postData: Record<string, any>) {
  // console.log('saveDialog>>>>> postData', postData)
  const res = await fetch(`${baseURL}/api/saveDialog`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })

  const data = await res.json()
  return data
}
// postMessage
const API_KEY = 'app-OlSUp08Ko1vxlaN50F010Mys'
const AGENT_MESSAGE = 'agent_message'
const AGENT_THOUGHT = 'agent_thought'

export async function sendMessage(userStr: string, timestamp: number, setResult: Function, botId: string) {
  setResult({timestamp, dialog:{ userStr, botStr: '' }})
  const data = {
    "inputs": {},
    "query": userStr,
    "response_mode": "streaming",
    "user": "abc-123",
  }
  const res = await fetch('https://aiagent.marsyoo.com/v1/chat-messages', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  // console.log('res type', res?.body instanceof ReadableStream)
  // 解析返回的流
  const reader = (res.body as ReadableStream).getReader();
  const decoder = new TextDecoder('utf-8');
  let botStr = ''
  async function handleStream() {
    const result = await reader.read()
    const { done, value } = result as { done: boolean, value: Uint8Array | undefined }
    if (done) {
      // console.log('----------stream finished----------')
      return
    } else {
      let resultString =''
      const chunk = decoder.decode(value, { stream: true })
      console.log('chunk', chunk)
      const dataList = chunk.trim().split('\n\n').map(item => {
        return JSON.parse(item.slice(5))
      })
      for (const item of dataList) {
        if(item.event === AGENT_MESSAGE){
          resultString += item.answer
          setResult({timestamp, dialog:{ userStr, botStr: resultString }})
          // console.log('AGENT MESSAGE>>>>> resultString', resultString)
          botStr = resultString
        }
        if(item.event === AGENT_THOUGHT && !item.thought){
          resultString = item.thought
          setResult({timestamp, dialog:{ userStr, botStr: resultString }})
          // console.log('AGENT THOUGHT>>>>> resultString', resultString)
          botStr = resultString
        }
      }
      await handleStream()
    }
  }
  await handleStream()
  // console.log('generate botStr>>>>>>>>>>', botStr)
  await saveDialog({ botId, timestamp, dialog:{ userStr, botStr }})
}
