import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    accessToken: string;
  }
}

declare module "next-auth" {
  interface User {
    administrationId: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}
