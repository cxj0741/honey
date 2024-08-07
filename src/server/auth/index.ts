import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { Adapter } from 'next-auth/adapters'
import NextAuth, { AuthOptions } from 'next-auth'
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server/db"
import sha256 from 'crypto-js/sha256'
import { users } from '@/server/db/schema'
import { sql } from 'drizzle-orm/sql'

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: DrizzleAdapter(db)  as (Adapter | undefined),
  callbacks: {
    async session({ session, token }) {
      const [user] = await db.select().from(users).where(sql`${users.id} = ${token.sub}`)
      if (session && session.user) {
        (session.user as any).id = user.id;
        (session.user as any).name = user.name;
        (session.user as any).image = user.image;
        (session.user as any).email = user.email;
        (session.user as any).tokens = user.tokens;
        (session.user as any).isAdult = user.isAdult;
        (session.user as any).gender = user.gender;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your email"  }
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        let {email, password} = credentials
        if(!email || !password) return null

        const [user] = await db
        .select()
        .from(users)
        .where(sql`${users.email} = ${email}`)

        if(!user) {return null} //没有用户
        const hashPassword = sha256(password).toString()
        if(user.hashPassword === ''){
          await db.update(users).set({hashPassword}).where(sql`${users.email} = ${email}`)
          return {...user, hashPassword}
        }
        // if(user.hashPassword === password){
        //   return user
        // }
        if(user.hashPassword !== hashPassword){
          return null
        }
        return user
      },
    }),
  ],
  pages:{
    signIn:'/login',
    signOut:'/',
    error:'/login',
  }
}

export const handler = NextAuth(authOptions)