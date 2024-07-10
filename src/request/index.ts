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

export async function deleteUser() {
  const res = await fetch(`${baseURL}/api/deleteUser`)
  // console.log('res>>>>>', res)
  const data = await res.json()
  // console.log('data>>>>>', data)
  return data
}

export async function setConversationId(id: string, conversationId: string) {
  const res = await fetch(
    `${baseURL}/api/setConversationId?id=${id}&conversationId=${conversationId}`
  )
  // console.log('res>>>>>', res)
  const data = await res.json()
  // console.log('data>>>>>', data)
  return data
}

export async function getUserInfo() {
  const res = await fetch(`${baseURL}/api/getUserInfo`)
  const data = await res.json()
  console.log('data>>>>> userData', data)
  return data
}

export async function changeUserInfo(name: string, str: string) {
  const res = await fetch(
    `${baseURL}/api/changeUserInfo?name=${name}&str=${str}`
  )
  const data = await res.json()
  // console.log('data>>>>> userData', data)
  return data
}
