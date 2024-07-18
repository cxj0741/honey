import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types' // 需要安装 mime-types 依赖
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export const config = {
  api: {
    bodyParser: false, // 关闭默认的 body 解析器
  },
}

export async function POST(request: NextRequest) {
  const chunks = []
  // const uploadDir = path.join(process.cwd(), '/public/avatars')
  // if (!fs.existsSync(uploadDir)) {
  //   fs.mkdirSync(uploadDir, { recursive: true })
  // }
  // 从请求头获取文件名和类型
  const fileName = request.headers.get('X-File-Name')
  const fileType = request.headers.get('X-File-Type')
  const fileExtension = mime.extension(fileType as string)
  console.log('basic info', fileName, fileType, fileExtension)
  // 确保文件名和类型存在
  /**
  if (!fileName || !fileType || !fileExtension) {
    return new NextResponse(JSON.stringify({ error: '无效的文件类型或名称' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
   */
  // 生成文件路径
  const rootPath = `/avatars/${path.parse(fileName as string).name}.${fileExtension}`
  // console.log('rootPath', rootPath)
  const filePath = path.join(process.cwd(),`/public${rootPath}`)
  // console.log('filePath>>>>>', filePath, request.headers)
  for await (const chunk of request.body as any) {
    chunks.push(chunk)
  }
  const buffer = Buffer.concat(chunks)
  fs.writeFileSync(filePath, buffer)
  const imageUrl = request.headers.get('origin') + rootPath
  // console.log('imageUrl', imageUrl)
  const userId = await getUserId()
  await db
    .update(users)
    .set({ image: imageUrl })
    .where(sql`${users.id} = ${userId}`)
  return NextResponse.json({message: 'upload image success!'})
}
