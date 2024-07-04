import { isMobile } from '@/app/detectDevice'
import WebChat from '@/components/web-pages/Chat'
import H5Chat from '@/components/h5-pages/Chat'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'
import { bots } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'

export default async function Chat({ params, searchParams }: { params: string, searchParams: Record<string, any> }) {
  console.log('params', params)
  const bot = await db
    .select()
    .from(bots)
    .where(sql`${bots.id} = ${params.id!}`)
  console.log('bot info', bot)
  if (bot.length) {
    return isMobile() ? <H5Chat /> : <WebChat />
    // return isMobile() ? <H5Chat {...(bot[0])} /> : <WebChat {...(bot[0])} />
  } else {
    redirect('/')
  }
}
// useRouter在客户端使用，redirect在服务器端使用