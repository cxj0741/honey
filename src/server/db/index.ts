import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema' //获取schema的信息

const proConfig = {
  host: 'ep-round-king-a6u1v4c7.us-west-2.aws.neon.tech',
  port: 5432,
  user: 'default',
  password: 'irIh2csCg9Qe',
  database: 'verceldb',
  ssl: true,
}

const devConfig = {
  host: 'ep-round-king-a6u1v4c7.us-west-2.aws.neon.tech',
  port: 5432,
  user: 'default',
  password: 'irIh2csCg9Qe',
  // 两个数据库 测试环境和正式环境 honeydemo和honeybun
  database: 'verceldb',
  ssl: true,
}
let config = proConfig
// console.log('devConfig>>>>>', devConfig)
if (process.env.NODE_ENV === 'development') {
  config = devConfig
} else {
  config = proConfig
}

// const client = new Client(config)
// await client.connect()
// export const db = drizzle(client, { schema })
// 使用数据库连接池
const pool = new Pool(config)
export const db = drizzle(pool, { schema })

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
