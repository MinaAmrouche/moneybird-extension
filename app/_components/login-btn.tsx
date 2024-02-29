"use client";

import { signIn, signOut } from "next-auth/react";

export default function LoginBtn({
  user,
}: {
  user:
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | undefined;
}) {
  if (user) {
    return (
      <>
        Signed in as {user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return <button onClick={() => signIn()}>Sign in</button>;
}
