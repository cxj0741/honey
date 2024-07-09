import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { chats } from '@/server/db/schema'
import { getUserId } from '@/utils/getUserId'

async function streamToArrayBuffer(stream:ReadableStream) {
  const reader = stream.getReader();
  const chunks = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      chunks.push(value);
    }
  }

  const arrayBuffer = new Uint8Array(chunks.reduce((acc, val) => acc.concat(Array.from(val)), [])).buffer;
  return arrayBuffer;
}

// async function readJSONBody(req: NextRequest) {
//   const chunks = []
//   for await (const chunk of req.body) {
//     chunks.push(chunk)
//   }
//   const rawBody = Buffer.concat(chunks).toString('utf-8')
//   return JSON.parse(rawBody)
// }

export async function POST(request: NextRequest) {
  const userId = await getUserId()
  // console.log(
  //   '------saveDialog request------',
  //   request.body instanceof ReadableStream
  // )
  // const body = await readJSONBody(request)
  const arrayBuffer = await streamToArrayBuffer(request.body as ReadableStream<Uint8Array>);
  const text = new TextDecoder('utf-8').decode(arrayBuffer);
  const body = JSON.parse(text);
  const { botId, timestamp, dialog } = body
  // console.log(
  //   '------body------',
  //   userId,
  //   botId,
  //   timestamp,
  //   JSON.stringify(dialog)
  // )
  await db
    .insert(chats)
    .values({ userId, botId, timestamp, dialog: JSON.stringify(dialog) })
  return NextResponse.json({ message: 'save dialog success!' })
}
