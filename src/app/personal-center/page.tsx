import { isMobile } from '@/app/detectDevice'
import WebPersonalCenter from '@/components/web-pages/PersonalCenter'
import H5PersonalCenter from '@/components/h5-pages/PersonalCenter'
import { db } from '@/server/db'
import { getUserId } from '@/utils/getUserId'
import { orders, users } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'

export default async function PersonalCenter() {
  const userId = await getUserId()
  const userList = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${userId}`)
  // console.log('user info', userList[0])
  // console.log(userList[0].createdAt instanceof Date)
  const orderArray = await db
    .select()
    .from(orders)
    .where(sql`${orders.userId} = ${userId}`)
  return isMobile() ? <H5PersonalCenter /> : <WebPersonalCenter user={userList[0]} orderArray={orderArray} />
}
