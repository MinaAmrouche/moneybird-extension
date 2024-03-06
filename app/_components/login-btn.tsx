"use client";

import { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export default function LoginBtn({ user }: { user: User | null }) {
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
