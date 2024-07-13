const AGENT_THOUGHT = 'agent_thought'
const ERROR_FORMAT = 'ERROR_FORMAT'

export async function sendMessage(apiKey: string, userInfo: {userStr:string, conversationId:string, user:string}) {
  let {userStr, conversationId, user}= userInfo
  const data = {
    query: userStr,
    conversation_id:conversationId,
    user,
    inputs: {},
    response_mode: "streaming",
  }
  const res = await fetch('https://aiagent.marsyoo.com/v1/chat-messages', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  // console.log('res type', res?.body instanceof ReadableStream)
  // 解析返回的流
  const reader = (res.body as ReadableStream).getReader();
  const decoder = new TextDecoder('utf-8');
  let botStr:string = ''
  let images:string[] = []
  async function handleStream() {
    const result = await reader.read()
    const { done, value } = result as { done: boolean, value: Uint8Array | undefined }
    if (done) {
      // console.log('----------stream finished----------')
      return
    } else {
      const chunk = decoder.decode(value, { stream: true })
      console.log('chunk', chunk)
      const dataList = chunk.trim().split('\n\n').map(item => {
        try {
          const obj = JSON.parse(item.slice(5))
          return obj
        } catch (error) {
          return ERROR_FORMAT
        }
      }).filter(item => item.event === AGENT_THOUGHT)
      console.log('dataList>>>>>', dataList)
      for (const item of dataList) {
        if(!conversationId && item.conversation_id){
          conversationId = item.conversation_id
        }
        if(item.thought){
          if(item.observation){
            try {
              const obj = JSON.parse(item.observation)
              const image =  JSON.parse(obj?.create_image_chat)?.image_url?.signedUrl
              images.push(image)
            } catch (error) {
              console.log('JSON parse error', error)
            }
          }
          botStr = item.thought as string
        }
      }
      await handleStream()
    }
  }
  await handleStream()
  return [botStr, images, conversationId]
}
