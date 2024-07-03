import { relations } from "drizzle-orm"
import {
  pgTable,
  timestamp,
  text,
  primaryKey,
  integer,
  boolean,
  date,
  uuid,
  varchar,
  index,
  unique,
  serial,
  json,
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
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // 这个表格上面的内容是next-auth adapter自动生成的内容
  hashPassword: text('hash_password').notNull().default(''),
  isVIP: boolean('is_vip').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})
 
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
export const bots = pgTable('bot',{
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }).notNull(),
  age:integer("age"),
  body: varchar("body", { length: 100 }).notNull(),
  ethnicity: varchar("ethnicity", { length: 100 }).notNull(),
  personality: varchar("personality", { length: 100 }).notNull(),
  occupation: varchar("occupation", { length: 100 }).notNull(),
  hobbies: varchar("hobbies", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  isCustom: boolean("is_custom").default(false),
  end: varchar("end", {
    enum: ["web", "app", "both"],
  }).notNull(),
  delete: boolean('delete').default(false)
})

/**
export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);
 */

export const usersToBots = pgTable(
  'user_to_bot',
  {
    userId: text("user_id").notNull().references(() => users.id),
    botId: text("bot_id").notNull().references(() => bots.id),
  },
  (t)=>({
    pk: primaryKey({columns:[t.userId, t.botId]})
  })
)
/**
export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
 */

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
export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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