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
  // callbacks: {
  //   async session({ session, user }) {
  //     if (session.user && user) {
  //       session.user.id = user.id;
  //     }
  //     return session;
  //   },
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "email", placeholder: "enter your email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        let {email, password} = credentials
        if(!email || !password) return null

        const user = await db.query.users.findFirst({
          where: ((users, { eq, and }) => and(eq(users.email, email), eq(users.hashPassword, sha256(password).toString()))),
        })
        return user || null
      },
    })
  ],
  pages:{
    signIn: '/src/app/auth/SignIn.tsx'
  }
}

export const handler = NextAuth(authOptions)