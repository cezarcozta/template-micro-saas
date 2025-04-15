'use server';

import { auth, signIn, signOut } from "../lib/auth";

export async function handleGoogleAuth() {
  const session = await auth();
  if (session) {
    return await signOut({
      redirectTo: '/login'
    })
  }
  await signIn("google", { redirectTo: '/dashboard' });
}