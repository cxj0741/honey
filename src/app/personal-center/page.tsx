import { isMobile } from '@/app/detectDevice'
import WebPersonalCenter from '@/components/web-pages/PersonalCenter'
import H5PersonalCenter from '@/components/h5-pages/PersonalCenter'
import { db } from '@/server/db'
import { getUserId } from '@/utils/getUserId'
import { users } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'

export default async function PersonalCenter() {
  const userId = await getUserId()
  let userList = await db
    .select()
    .from(users)
    .where(sql`${users.id} = ${userId}`)
  console.log('user info', userList[0])
  console.log(userList[0].createdAt instanceof Date)
  return isMobile() ? <H5PersonalCenter /> : <WebPersonalCenter user={userList[0]} />
}
