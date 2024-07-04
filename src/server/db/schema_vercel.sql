-- \l 查看所有数据库
-- \c databasename; 切换到指定的数据库
-- \dt 查看当前数据库的所有的表格
-- create database database_name; 创建数据库，默认参数
-- delete database DATABASE_name;删除指定的数据库
-- 可以删除postgre指定数据库下面的所有表格
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

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

CREATE TABLE IF NOT EXISTS "session" (
        "sessionToken" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL,
        "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationToken" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);

CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" serial NOT NULL,
        "name" text,
        "email" text NOT NULL,
        "emailVerified" timestamp,
        "image" text,
        "hash_password" text DEFAULT '' NOT NULL,
        "is_vip" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- 所有以单数命名的表格都是next-auth进行google账号自动登录相关的表格
-- 其中的列字段名称使用驼峰命名是自动保持一致，如果修改会导致错误

CREATE TABLE IF NOT EXISTS "bots" (
        "id" text PRIMARY KEY NOT NULL,
        "bot_id" serial NOT NULL,
        "type" varchar NOT NULL,
        "name" varchar(100) NOT NULL,
        "age" integer,
        "body" varchar(100) NOT NULL,
        "ethnicity" varchar(100) NOT NULL,
        "personality" varchar(100) NOT NULL,
        "occupation" varchar(100) NOT NULL,
        "hobbies" varchar(100) NOT NULL,
        "relationship" varchar(100) NOT NULL,
        "is_custom" boolean DEFAULT false,
        "end_type" varchar NOT NULL,
        "delete" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "orders" (
        "id" text PRIMARY KEY NOT NULL,
        "order_id" serial NOT NULL,
        "type" varchar NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "status" varchar NOT NULL,
        "user_id" text
);

CREATE TABLE IF NOT EXISTS "users_to_bots" (
        "user_id" text NOT NULL,
        "bot_id" text NOT NULL,
        CONSTRAINT "users_to_bots_user_id_bot_id_pk" PRIMARY KEY("user_id","bot_id")
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
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_bots" ADD CONSTRAINT "users_to_bots_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_bots" ADD CONSTRAINT "users_to_bots_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
