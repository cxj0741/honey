import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { Adapter } from 'next-auth/adapters'
import NextAuth, { AuthOptions } from 'next-auth'

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server/db";
import sha256 from 'crypto-js/sha256'

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: DrizzleAdapter(db)  as (Adapter | undefined),
  callbacks: {
    async signIn(...args) {
      console.log('sign in args', args)
      return true
    }
  //   async session({ session, token }) {
  //     console.log("session>>>>>>>>>>", session)
  //     console.log("token>>>>>>>>>>", token)
  //     // if (session.user && user) {
  //     //   session.user.id = user.id;
  //     // }
  //     return session;
  //   },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "enter your email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        let {email, password} = credentials
        if(!email || !password) return null

        const user = await db.query.users.findFirst({
          // where: ((users, { eq, and }) => and(eq(users.email, email), eq(users.hashPassword, sha256(password).toString()))),
          where: ((users, { eq }) => eq(users.email, email)),
        })

        if(user?.hashPassword === sha256(password).toString()){
          return user
        }

        return null
      },
    })
  ],
  // pages:{
  //   signIn: '/src/app/auth/signin'
  // }
}

export const handler = NextAuth(authOptions)