import { relations } from "drizzle-orm"
import {
  pgTable,
  serial,
  timestamp,
  text,
  primaryKey,
  integer,
  boolean,
  varchar,
  bigint,
  // date,
  // uuid,
  // index,
  // unique,
  // json,
} from 'drizzle-orm/pg-core'

import type { AdapterAccount } from "next-auth/adapters"
/*
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  下面的表格是next-auth与drizzle-orm结合需要的table信息，直接从网站获取的
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
// 用户基本信息表和鉴权相关信息表
export const users = pgTable("user", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  gender: varchar("gender", {
    enum: ["Male", "Female"],
  }).notNull().default('Male'),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // 这个表格上面的内容是next-auth adapter自动生成的内容
  userId: serial('user_id'),
  hashPassword: text('hash_password').notNull().default(''),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  vipLevel:integer('vip_level').default(0), //vip的等级，0级是普通用户，1 2 3级别依次递增
  messages: integer('messages').default(10), //每天开始定时更新 普通用户10条，vip用户如果低于10条更新为10条
  tokens: integer('tokens').default(5), //每月首日定时更新 普通用户5个
  vipDeadline: timestamp('vip_deadline', { mode: 'date' }).defaultNow(),
})

// export const users = pgTable("user", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   name: text("name"),
//   email: text("email").notNull(),
//   emailVerified: timestamp("emailVerified", { mode: "date" }),
//   image: text("image"),
// })
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount['type']>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)
/*
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  上面的表格是next-auth与drizzle-orm结合需要的table信息，直接从网站获取的
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
// 机器人列表
export const bots = pgTable('bots',{
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), //自动生成
  botId: serial('bot_id'), //自动生成
  key: varchar("key", { length: 50 }).notNull().default(''), //api-key不超过50位
  type: varchar("type", {
    enum: ["girls", "guys", "anime"], //3种类型
  }).notNull(),
  name: varchar("name", { length: 100 }).notNull(), //姓名
  age:integer("age"), //年龄
  description: varchar("description", { length: 500 }).notNull(), //描述信息
  image1: varchar("image1", { length: 100 }).notNull(), //图片1
  image2: varchar("image2", { length: 100 }).notNull(), //图片2
  body: varchar("body", { length: 100 }).notNull(), //体型描述
  ethnicity: varchar("ethnicity", { length: 100 }).notNull(), //种族
  personality: varchar("personality", { length: 100 }).notNull(), //个性
  occupation: varchar("occupation", { length: 100 }).notNull(), //职业
  hobbies: varchar("hobbies", { length: 100 }).notNull(), //兴趣
  relationship: varchar("relationship", { length: 100 }).notNull(), //关系，一般是N/A
  isCustom: boolean("is_custom").default(false), //是否是用户自定义bot，一般是false
  endType: varchar("end_type", {
    enum: ["web", "app", "both"], //可以这个bot的前端类似，有web，app和两个端都可以使用3种类型
  }).notNull(),
  isDeleted: boolean('is_deleted').default(false), //是否已经删除了，默认是false
  start: text("start"), //开场白
})

export const usersToBots = pgTable(
  'users_to_bots',
  {
    userId: text("user_id").notNull().references(() => users.id,{ onDelete: "cascade" } ),
    botId: text("bot_id").notNull().references(() => bots.id),
    timestamp: bigint('timestamp', { mode: 'number'}).notNull(),
    botStr: text("bot_str").notNull().default(''),
    conversationId: text('conversation_id').default(''),
  },
  (t)=>({
    pk: primaryKey({columns:[t.userId, t.botId]})
  })
)

export const usersRelations1 = relations(users, ({ many }) => ({
  usersToBots: many(usersToBots),
}))

export const botsRelations = relations(bots, ({ many }) => ({
  usersToBots: many(usersToBots),
}))

export const usersToBotsRelations = relations(usersToBots, ({ one }) => ({
  bot: one(bots, {
    fields: [usersToBots.botId],
    references: [bots.id],
  }),
  user: one(users, {
    fields: [usersToBots.userId],
    references: [users.id],
  }),
}))

export const chats = pgTable(
  'chats',
  { 
    chatId: serial('chat_id'),
    userId: text("user_id").notNull().references(() => users.id,{ onDelete: "cascade" } ),
    botId: text("bot_id").notNull(),
    timestamp: bigint('timestamp', { mode: 'number'}).notNull(),
    dialog: text('dialog').notNull(),
    isDeleted: boolean('is_deleted').default(false)
  },
  (t)=>({
    pk: primaryKey({columns:[t.userId, t.botId,t.timestamp]})
  })
)

// 用户购买订单记录
export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: serial('order_id'),
  type: varchar("type", {
    enum: ["1", "3", "12"], //订单类型
  }).notNull(),
  amount: text('amount').notNull(), //用户每次付费支付的金额
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(), //订单创建日期
  status: varchar("status", {
    enum: ["success", "failure"],
  }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: "cascade" } ),
})

export const userRelations2 = relations(users, ({ many }) => ({
  orders: many(orders),
}))

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}))

// 用户使用消费记录，可用于后续统计更新bot的功能
export const records = pgTable('records',{
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), //主键uuid
  recordId: serial('record_id'), //自增id
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(), //消费日期
  botId: text('bot_id'), //bot的id
  chatId: text('chat_id'), //聊天记录id标识
  type:varchar("type", {
    enum: ["message", "photo"], //消费类型有很多种，photo包括message，后续的video和audio也包括message
  }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: "cascade" } ),
})

export const userRelations3 = relations(users, ({ many }) => ({
  records: many(records),
}))

export const recordsRelations = relations(records, ({ one }) => ({
  user: one(users, {
    fields: [records.userId],
    references: [users.id],
  }),
}))
