let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000'
  // baseURL = 'http://192.168.10.76:3000'
} else {
  baseURL = 'https://www.honeybun.ai'
}

export const TYPE = {
  MALE: 'guys',
  FEMALE: 'girls',
  ANIME: 'anime',
}

export async function getBots(type: string) {
  const res = await fetch(`${baseURL}/api/bots?type=${type}`)
  const data = await res.json()
  return data
}

export async function signUp(postData: Record<string, any>) {
  // console.log('saveDialog>>>>> postData', postData)
  const res = await fetch(`${baseURL}/api/signUp`, {
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
  // console.log('deleteUserBot', id)
  const res = await fetch(`${baseURL}/api/deleteUserBot?id=${id}`)
  const data = await res.json()
  return data
}

export async function deleteBotDialogs(id: string) {
  // console.log('deleteDialogs', id)
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
  const data = await res.json()
  return data
}

export async function setConversationId(id: string, conversationId: string) {
  const res = await fetch(
    `${baseURL}/api/setConversationId?id=${id}&conversationId=${conversationId}`
  )
  const data = await res.json()
  return data
}

export async function getUserInfo() {
  const res = await fetch(`${baseURL}/api/getUserInfo`)
  const data = await res.json()
  // console.log('data>>>>> userData', data)
  return data
}

export async function changeUserInfo(name: string, str: string) {
  const res = await fetch(`${baseURL}/api/changeUserInfo`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, str }),
  })
  // console.log('res', res)
  const data = await res.json()
  // console.log('data>>>>> userData', data)
  return data
}
// 这个是nextjs的上传图片
export async function uploadAvatar(file: File) {
  // console.log('file', file)
  // console.log('file.name', file.name)
  // console.log('file', file.type)
  const res = await fetch(`${baseURL}/api/uploadAvatar`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-File-Name': file.name,
      'X-File-Type': file.type,
    },
    body: file,
  })
  // console.log('res', res)
  const data = await res.json()
  // console.log('data>>>>> userData', data)
  return data
}

export async function uploadAvatarToCloud(formData: FormData) {
  console.log('formData', formData)
  const res1 = await fetch('https://honeybun-obejcts.vercel.app/upload', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'api-key': 'ABCPPOOO233ddWWW', // 用于传递 API 密钥
    },
    body: formData,
  })
  const data1 = await res1.json()
  const res2 = await fetch(
    `https://honeybun-obejcts.vercel.app/generate_presigned_url/?file_key=${data1.file_key}`,
    {
      mode: 'cors',
      headers: {
        'api-key': 'ABCPPOOO233ddWWW', // 用于传递 API 密钥
      },
    }
  )
  const data2 = await res2.json()
  const data = await changeUserInfo('image', data2.presigned_url)
  return data
}

export async function subscribe(email: string, amount: number) {
  const res = await fetch('https://honeybun-pay.vercel.app/subscribe/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, amount }),
  })
  console.log('res>>>>>> subscribe', res)
  const data = await res.json()
  return data
}

export async function getUserVIPInfo() {
  const res = await fetch('https://honeybun-pay.vercel.app/user/22/vip_info/')
  const data = await res.json()
  return data
}
