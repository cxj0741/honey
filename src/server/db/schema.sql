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

CREATE TABLE IF NOT EXISTS "bot" (
        "id" text PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "age" integer,
        "body" varchar(100) NOT NULL,
        "ethnicity" varchar(100) NOT NULL,
        "personality" varchar(100) NOT NULL,
        "occupation" varchar(100) NOT NULL,
        "hobbies" varchar(100) NOT NULL,
        "relationship" varchar(100) NOT NULL,
        "is_custom" boolean DEFAULT false,
        "end" varchar NOT NULL,
        "delete" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "order" (
        "id" text PRIMARY KEY NOT NULL,
        "type" varchar NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "status" varchar NOT NULL,
        "user_id" text
);

CREATE TABLE IF NOT EXISTS "session" (
        "sessionToken" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL,
        "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text,
        "email" text NOT NULL,
        "emailVerified" timestamp,
        "image" text,
        "hash_password" text DEFAULT '' NOT NULL,
        "is_vip" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_to_bot" (
        "user_id" text NOT NULL,
        "bot_id" text NOT NULL,
        CONSTRAINT "user_to_bot_user_id_bot_id_pk" PRIMARY KEY("user_id","bot_id")
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
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_to_bot" ADD CONSTRAINT "user_to_bot_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_to_bot" ADD CONSTRAINT "user_to_bot_bot_id_bot_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
