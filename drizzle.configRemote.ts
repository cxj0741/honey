import { defineConfig } from 'drizzle-kit'

// psql "postgres://default:irIh2csCg9Qe@ep-round-king-a6u1v4c7.us-west-2.aws.neon.tech:5432/verceldb?sslmode=require"
export default defineConfig({
  // 创建数据table的schema配置内容，和SQL完全可以映射
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql', //不同的数据库有不同的dialect
  dbCredentials: {
    //数据库连接的各种配置
    host: 'ep-round-king-a6u1v4c7.us-west-2.aws.neon.tech',
    port: 5432,
    user: 'default',
    password: 'irIh2csCg9Qe',
    database: 'verceldb',
    ssl: true,
  },
  verbose: true,
  strict: true,
})

// 这个命令执行的是创建数据表
// npx drizzle-kit push

// 启动可视化界面
// npx drizzle-kit studio
// npx drizzle-kit push --config=drizzle.configLocal.ts
// npx drizzle-kit push --config=drizzle.configRemote.ts