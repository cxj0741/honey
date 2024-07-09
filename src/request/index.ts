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
/**
const API_KEY = 'app-OlSUp08Ko1vxlaN50F010Mys'
export async function postMessage(
  userStr: string,
  timestamp: number,
  setResult: Function,
  botId: string
) {
  setResult({ timestamp, dialog: { userStr, botStr: '' } })
  const data = {
    inputs: {},
    query: userStr,
    response_mode: 'blocking',
    user: 'abc-123',
  }
  const res = await fetch('https://aiagent.marsyoo.com/v1/chat-messages', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  console.log('返回的结果', result)
  console.log('return answer', result.answer)
  setResult({ timestamp, dialog: { userStr, botStr: result.answer } })
  await saveDialog({
    botId,
    timestamp,
    dialog: { userStr, botStr: result.answer },
  })
}

export async function stopChat(
  userStr: string,
  timestamp: number,
  setResult: Function,
  botId: string
) {
  setResult({ timestamp, dialog: { userStr, botStr: '' } })
  const data = {
    inputs: {},
    query: userStr,
    response_mode: 'blocking',
    user: 'abc-123',
  }
  const res = await fetch(`https://aiagent.marsyoo.com/v1/chat-messages/${taskId}/stop`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  console.log('返回的结果', result)
  console.log('return answer', result.answer)
  setResult({ timestamp, dialog: { userStr, botStr: result.answer } })
  await saveDialog({
    botId,
    timestamp,
    dialog: { userStr, botStr: result.answer },
  })
}
POST
/chat-messages/:task_id/stop
curl -X POST 'http://aiagent.marsyoo.com/v1/chat-messages/:task_id/stop' \
-H 'Authorization: Bearer {api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{ "user": "abc-123"}'
CopyCopied!
 */