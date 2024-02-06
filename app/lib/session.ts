import { getServerSession } from "next-auth/next"

import { authOptions } from "@/app/lib/auth";

export async function getSession() {
  const session = await getServerSession(authOptions)

  return session;
}