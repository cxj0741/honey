const API_KEY = 'app-z8egrB8DY8hRfoVxda1BPwMH'
const AGENT_MESSAGE = 'agent_message'
const AGENT_THOUGHT = 'agent_thought'
const ERROR_FORMAT = 'ERROR_FORMAT'

export async function sendMessage(userStr: string, timestamp: number, setResult: Function) {
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
  let image = ''
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
        try {
          const obj = JSON.parse(item.slice(5))
          return obj
        } catch (error) {
          return ERROR_FORMAT
        }
      }).filter(item => item !== ERROR_FORMAT)
      console.log('dataList>>>>>', dataList)
      for (const item of dataList) {
        if(item.event === AGENT_MESSAGE){
          resultString += item.answer
          setResult({timestamp, dialog:{ userStr, botStr: resultString }})
          // console.log('AGENT MESSAGE>>>>> resultString', resultString)
          botStr = resultString
        }
        if(item.event === AGENT_THOUGHT && !item.thought){
          resultString = item.thought
          if(item.observation){
            try {
              const obj = JSON.parse(item.observation)
              image =  JSON.parse(obj?.create_image_chat)?.image_url?.signedUrl
            } catch (error) {
              console.log('JSON parse error', error)
            }
          }
          setResult({timestamp, dialog:{ userStr, botStr: resultString, image }})
          // console.log('AGENT THOUGHT>>>>> resultString', resultString)
          botStr = resultString
        }
      }
      await handleStream()
    }
  }
  await handleStream()
  // console.log('generate botStr>>>>>>>>>>', botStr)
  return botStr
}
