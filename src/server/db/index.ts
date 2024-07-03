import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './schema' //获取schema的信息

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  // 两个数据库 测试环境和正式环境 honeydemo和honeybun
  database: 'honeytest', 
  ssl: false,
})

await client.connect()
export const db = drizzle(client, { schema })

// const db = drizzle(client)
// console.log('db connect>>>>>>>>>>', db)
// drizzle使用node-progress/pg和postgres交互

// 不使用orm框架直接与数据库交互
/**
import { Client } from 'pg'
const client = new Client({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
})
client.connect()
client.query('SELECT * FROM users', (err, res) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(res.rows)
  client.end()
})
*/