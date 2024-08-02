import { isMobile } from '@/app/detectDevice'
import WebChat from '@/components/web-pages/Chat'
import H5Chat from '@/components/h5-pages/Chat'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'
import { bots, usersToBots } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'
import NoBot from './NoBot'

export default async function Chat({ searchParams }: { searchParams: Record<string, any> }) {
  console.log('searchParams', searchParams)
  let id = searchParams?.botId?.trim()
  const userId = await getUserId()
  // console.log('userId', userId, id)

  let usersToBotsArray = await db
    .select()
    .from(usersToBots)
    .where(sql`${usersToBots.userId} = ${userId}`)
  // console.log('usersToBotsArray CHAT', usersToBotsArray)
  if (!id) {
    if (usersToBotsArray.length) {
      id = usersToBotsArray[0].botId
    } else {
      return <NoBot />
    }
  }
  const botArray = await db
    .select()
    .from(bots)
    .where(sql`${bots.id} = ${id}`)
  // console.log('botArray info', botArray)

  if (botArray.length) {
    // 保存之前没有出现的bot
    const relation = await db
      .select()
      .from(usersToBots)
      .where(sql`${usersToBots.userId} = ${userId} and ${usersToBots.botId} = ${id}`)
    if (!relation.length) {
      const timestamp = Date.now()
      await db.insert(usersToBots).values({ userId, botId: id, timestamp })
      usersToBotsArray.push({ userId, botId: id, timestamp, botStr: '', conversationId: '' })
    }


    let userBotArray = []
    for (const item of usersToBotsArray) {
      const [bot] = await db
        .select()
        .from(bots)
        .where(sql`${bots.id} = ${item.botId}`)
      userBotArray.push({ ...bot, lastTime: item.timestamp, botStr: item.botStr, conversationId: item.conversationId, show: true })
    }
    userBotArray.sort((pre, cur) => cur.lastTime - pre.lastTime)
    return isMobile() ? <H5Chat userBotArray={userBotArray} botId={id} /> : <WebChat userBotArray={userBotArray} botId={id} />
  } else {
    redirect('/')
  }
}
// useRouter在客户端使用，redirect在服务器端组件中使用