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
  date,
  uuid,
  index,
  unique,
  json,
} from 'drizzle-orm/pg-core'

import type { AdapterAccount } from "next-auth/adapters"
/*
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  下面的表格是next-auth与drizzle-orm结合需要的table信息，直接从网站获取的
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
// 用户基本信息表和鉴权相关信息表
export const users = pgTable("users", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  userId: serial('user_id'),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  // 这个表格上面的内容是next-auth adapter自动生成的内容
  hashPassword: text('hash_password').notNull().default(''),
  isVIP: boolean('is_vip').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})
 
export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount['type']>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
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
 
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verification_tokens",
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
  "authenticators",
  {
    credentialId: text("credential_id").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("provider_account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialId],
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
    .$defaultFn(() => crypto.randomUUID()),
  botId: serial('bot_id'),
  type: varchar("type", {
    enum: ["girls", "guys","anime"],
  }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  age:integer("age"),
  body: varchar("body", { length: 100 }).notNull(),
  ethnicity: varchar("ethnicity", { length: 100 }).notNull(),
  personality: varchar("personality", { length: 100 }).notNull(),
  occupation: varchar("occupation", { length: 100 }).notNull(),
  hobbies: varchar("hobbies", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  isCustom: boolean("is_custom").default(false),
  endType: varchar("end_type", {
    enum: ["web", "app", "both"],
  }).notNull(),
  delete: boolean('delete').default(false)
})

export const usersToBots = pgTable(
  'users_to_bots',
  {
    userId: text("user_id").notNull().references(() => users.id),
    botId: text("bot_id").notNull().references(() => bots.id),
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

// 订单列表
export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: serial('order_id'),
  type: varchar("type", {
    enum: ["1", "3", "12"],
  }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  status: varchar("status", {
    enum: ["success", "failure"],
  }).notNull(),
  userId: text('user_id')
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