"use client";

import { createAuthClient } from "better-auth/react";
import { ensureBaseUrl } from "@/lib/auth-url";

export const authClient = createAuthClient({
    baseURL: ensureBaseUrl(process.env.NEXT_PUBLIC_APP_URL),
});

export const { signIn, signOut, useSession } = authClient;
