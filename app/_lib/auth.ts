import { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/app/_lib/db";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any), // @see GitHub: https://github.com/nextauthjs/next-auth/issues/7727#issuecomment-1688714579
  providers: [
    {
      id: "moneybird",
      name: "Moneybird",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: `${process.env.OAUTH_URL}/authorize`,
        params: { scope: "sales_invoices time_entries" },
      },
      token: {
        url: `${process.env.OAUTH_URL}/token`,
      },
      userinfo: {
        async request({ tokens }) {
          try {
            const headers = {
              Authorization: `Bearer ${tokens.access_token}`,
            };
            const administrationRequest = await fetch(
              `${process.env.API_URL}/administrations`,
              { headers }
            );
            const administrations = await administrationRequest.json();

            if (!administrations[0]) {
              throw new Error("No administration found");
            }

            const res = await fetch(
              `${process.env.API_URL}/${administrations[0].id}/identities/default`,
              { headers }
            );

            return await res.json();
          } catch (error) {
            console.error(error);
            return null;
          }
        },
      },
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      profile: (profile: any) => {
        return {
          id: profile.id,
          email: profile.email,
          administrationId: profile.administration_id,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token ?? "";
      }

      if (token.email) {
        const dbUser = await db.user.findFirst({
          where: {
            email: token.email,
          },
        });

        if (!dbUser) {
          if (user) {
            token.user.id = user?.id;
          }
          return token;
        }

        token.user = {
          id: dbUser.id,
          email: dbUser.email,
          administrationId: dbUser.administrationId,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
