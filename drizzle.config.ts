import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // 创建数据table的schema配置内容，和SQL完全可以映射
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql', //不同的数据库有不同的dialect
  dbCredentials: {
    //数据库连接的各种配置
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    // 选择一个数据库，或者自己提前创建好一个数据库 honeydemo honeytest
    database: 'honeytest',
    // 不使用ssl安全校验模式
    ssl: false,
  },
  verbose: true,
  strict: true,
})

// 这个命令执行的是创建数据表
// npx drizzle-kit push

// 启动可视化界面
// npx drizzle-kit studio
