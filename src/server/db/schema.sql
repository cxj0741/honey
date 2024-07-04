
CREATE TABLE IF NOT EXISTS "accounts" (
        "user_id" text NOT NULL,
        "type" text NOT NULL,
        "provider" text NOT NULL,
        "provider_account_id" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "token_type" text,
        "scope" text,
        "id_token" text,
        "session_state" text,
        CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);

CREATE TABLE IF NOT EXISTS "authenticators" (
        "credential_id" text NOT NULL,
        "user_id" text NOT NULL,
        "provider_account_id" text NOT NULL,
        "credential_public_key" text NOT NULL,
        "counter" integer NOT NULL,
        "credential_device_type" text NOT NULL,
        "credential_backed_up" boolean NOT NULL,
        "transports" text,
        CONSTRAINT "authenticators_user_id_credential_id_pk" PRIMARY KEY("user_id","credential_id"),
        CONSTRAINT "authenticators_credential_id_unique" UNIQUE("credential_id")
);

CREATE TABLE IF NOT EXISTS "sessions" (
        "session_token" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
-- 只有users bots orders users_to_bots表格是自己创建的，其它表格是根据google登录需要第三方生成的
-- 登录注册的用户基本信息列表
CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL, --uuid主键
        "user_id" serial NOT NULL, --自增列
        "name" text, --用户姓名
        "email" text NOT NULL, --用户邮箱
        "email_verified" timestamp, --邮箱验证，google登录自动生成的
        "image" text, --头像
        "hash_password" text DEFAULT '' NOT NULL, --邮箱密码登录时的hash后密码
        "is_vip" boolean DEFAULT false, --默认刚创建的用户都不是vip
        "created_at" timestamp DEFAULT now(), --创建时间
        "updated_at" timestamp DEFAULT now() --更新时间
);
-- bot基本信息的列表
CREATE TABLE IF NOT EXISTS "bots" (
        "id" text PRIMARY KEY NOT NULL, --bot的uuid主键
        "bot_id" serial NOT NULL, --自增列
        "type" varchar NOT NULL, --bot类型，3种选一 guys girls anime
        "name" varchar(100) NOT NULL, --bot的name
        "age" integer, --年龄
        "body" varchar(100) NOT NULL, --身材描述
        "ethnicity" varchar(100) NOT NULL, --种族描述
        "personality" varchar(100) NOT NULL, --性格描述
        "occupation" varchar(100) NOT NULL, --身份描述
        "hobbies" varchar(100) NOT NULL, --兴趣爱好描述
        "relationship" varchar(100) NOT NULL, --candy.ai中有这个字段
        "is_custom" boolean DEFAULT false, --是否是用户自定义的bot
        "end_type" varchar NOT NULL, --可以使用该bot的终端类型，有web，app，both 3种类型
        "delete" boolean DEFAULT false --这个bot是否已经被删除
);
-- 用户订单信息列表
CREATE TABLE IF NOT EXISTS "orders" (
        "id" text PRIMARY KEY NOT NULL, --订单uuid主键列表
        "order_id" serial NOT NULL, --自增列
        "type" varchar NOT NULL, -- 订单的类型，时间描述，有1，3，12个月三种类型
        "created_at" timestamp DEFAULT now(), --订单创建的时间
        "status" varchar NOT NULL, --订单的状态，failure和success，描述订单是成功了还是失败了
        "user_id" text --外键，每个用户可以有多个订单
);
--用户和bot是多对多关系，每个用户可以有多个bot，每个bot可以有多个用户，这是描述用户和bot关系的表格
CREATE TABLE IF NOT EXISTS "users_to_bots" (
        "user_id" text NOT NULL,
        "bot_id" text NOT NULL,
        CONSTRAINT "users_to_bots_user_id_bot_id_pk" PRIMARY KEY("user_id","bot_id")
);

DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; 
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_bots" ADD CONSTRAINT "users_to_bots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_bots" ADD CONSTRAINT "users_to_bots_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;     
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
