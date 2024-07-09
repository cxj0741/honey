import { isMobile } from '@/app/detectDevice'
import WebChat from '@/components/web-pages/Chat'
import H5Chat from '@/components/h5-pages/Chat'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'
import { bots, usersToBots } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'
import { getUserId } from '@/utils/getUserId'

export default async function Chat({ searchParams }: { searchParams: Record<string, any> }) {
  console.log('searchParams', searchParams)
  let id = searchParams?.botId?.trim()
  const userId = await getUserId()
  console.log('userId', userId, id)
  if (!id) {
    let usersToBotsArray = await db
      .select()
      .from(usersToBots)
      .where(sql`${usersToBots.userId} = ${userId}`)
    // console.log('usersToBotsArray', usersToBotsArray)
    if (usersToBotsArray.length) {
      id = usersToBotsArray[0].botId
    } else {
      redirect('/')
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
      await db.insert(usersToBots).values({ userId, botId: id, timestamp: Date.now() })
    }

    // 获取user所有bot的基本信息
    const arr = await db
      .select()
      .from(usersToBots)
      .where(sql`${usersToBots.userId} = ${userId}`)
    // console.log('>>>>>>arr', arr)
    let userBotArray = []
    for (const item of arr) {
      const [bot] = await db
        .select()
        .from(bots)
        .where(sql`${bots.id} = ${item.botId}`)
      userBotArray.push(bot)
    }

    return isMobile() ? <H5Chat /> : <WebChat userBotArray={userBotArray} botId={id} />
    // return isMobile() ? <H5Chat {...(bot[0])} /> : <WebChat {...(bot[0])} />
  } else {
    redirect('/')
  }
}
// useRouter在客户端使用，redirect在服务器端组件中使用