
CREATE TABLE IF NOT EXISTS "account" (
        "userId" text NOT NULL,
        "type" text NOT NULL,
        "provider" text NOT NULL,
        "providerAccountId" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "token_type" text,
        "scope" text,
        "id_token" text,
        "session_state" text,
        CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);

CREATE TABLE IF NOT EXISTS "authenticator" (
        "credentialID" text NOT NULL,
        "userId" text NOT NULL,
        "providerAccountId" text NOT NULL,
        "credentialPublicKey" text NOT NULL,
        "counter" integer NOT NULL,
        "credentialDeviceType" text NOT NULL,
        "credentialBackedUp" boolean NOT NULL,
        "transports" text,
        CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
        CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);

CREATE TABLE IF NOT EXISTS "bots" (
        "id" text PRIMARY KEY NOT NULL, --uuid主键
        "bot_id" serial NOT NULL, --自增id
        "key" varchar(50) DEFAULT '' NOT NULL, --bot对应的apikey
        "type" varchar NOT NULL, --3种类型，girls guys anime
        "name" varchar(100) NOT NULL, --姓名
        "age" integer, --年龄
        "description" varchar(500) NOT NULL, --描述
        "image1" varchar(100) NOT NULL, -- 图片1
        "image2" varchar(100) NOT NULL, -- 图片2
        "body" varchar(100) NOT NULL, --体型
        "ethnicity" varchar(100) NOT NULL, --种族
        "personality" varchar(100) NOT NULL, --性格
        "occupation" varchar(100) NOT NULL, --职业
        "hobbies" varchar(100) NOT NULL, --兴趣爱好
        "relationship" varchar(100) NOT NULL, --关系
        "is_custom" boolean DEFAULT false, --是否为自定义bot
        "end_type" varchar NOT NULL, --可以使用这个bot的客户端类型
        "is_deleted" boolean DEFAULT false, --是否已经删除
        "start" text --开场白
);

CREATE TABLE IF NOT EXISTS "chats" (
        "chat_id" serial NOT NULL, --聊天记录
        "user_id" text NOT NULL, --用户id
        "bot_id" text NOT NULL, --bot id
        "timestamp" bigint NOT NULL, --一条对话时间戳
        "dialog" text NOT NULL, --一条对话内容
        CONSTRAINT "chats_user_id_bot_id_timestamp_pk" PRIMARY KEY("user_id","bot_id","timestamp")
);

-- CREATE TABLE IF NOT EXISTS "orders" (
--         "id" text PRIMARY KEY NOT NULL,
--         "order_id" serial NOT NULL,
--         "type" varchar NOT NULL,
--         "created_at" timestamp DEFAULT now(),
--         "status" varchar NOT NULL,
--         "user_id" text
-- );

CREATE TABLE IF NOT EXISTS "session" (
        "sessionToken" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL,
        "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL, --用户id
        "name" text, --用户姓名
        "email" text NOT NULL, --email唯一
        "emailVerified" timestamp,
        "image" text, --用户头像
        "user_id" serial NOT NULL, --自增id
        "hash_password" text DEFAULT '' NOT NULL, --hash后的密码
        "is_vip" boolean DEFAULT false, --是否是vip
        "messages" integer DEFAULT 10, --对话条数，未付费用户默认是每天10条，
        "tokens" integer DEFAULT 5, --tokens数量，未付费用户默认是每月5个
        "created_at" timestamp DEFAULT now(), --创建时间
        "updated_at" timestamp DEFAULT now() --更新时间
);

CREATE TABLE IF NOT EXISTS "users_to_bots" (
        "user_id" text NOT NULL, --用户id
        "bot_id" text NOT NULL, --bot的id
        "timestamp" bigint NOT NULL, --最新对话时间戳
        "conversation_id" text DEFAULT '', --对话id
        CONSTRAINT "users_to_bots_user_id_bot_id_pk" PRIMARY KEY("user_id","bot_id")
);

CREATE TABLE IF NOT EXISTS "verificationToken" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);

DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- DO $$ BEGIN
--  ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
-- EXCEPTION
--  WHEN duplicate_object THEN null;
-- END $$;

DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_bots" ADD CONSTRAINT "users_to_bots_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_bots" ADD CONSTRAINT "users_to_bots_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
