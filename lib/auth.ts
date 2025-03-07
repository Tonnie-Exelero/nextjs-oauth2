import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Configure the Prisma adapter
  adapter: PrismaAdapter(prisma),

  // Configure session strategy
  session: {
    strategy: "jwt",
  },

  // Configure providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Request additional scopes if needed
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // Callbacks to customize behavior
  callbacks: {
    async jwt({ token, user, account }) {
      // Add user ID to the token when first signing in
      if (account && user) {
        token.userId = user.id;

        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
      return token;
    },

    async session({ session, token }) {
      // Add user ID to the session
      if (token && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },

  // Custom pages
  pages: {
    signIn: "/",
    error: "/",
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
