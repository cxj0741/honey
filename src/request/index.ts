/**
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

postData('https://example.com/answer', { answer: 42 }).then((data) => {
  console.log(data) // JSON data parsed by `data.json()` call
})

function getBots(type: string) {
  fetch(`http://localhost:3000/api/bots?type=${type}`).then(res => {
    console.log('>>>res', res)
    return res.json()
  }).then(data => {
    console.log('data>>>>>', data)
  })
}
 */

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000'
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

export async function deleteUserBot(id: string) {
  const res = await fetch(`${baseURL}/api/deleteUserBot?id=${id}`)
  const data = await res.json()
  return data
}
