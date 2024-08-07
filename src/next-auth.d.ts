// ./src/next-auth.d.ts
import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string | null;
      gender?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
