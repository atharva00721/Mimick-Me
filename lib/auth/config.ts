import { headers } from "next/headers";
import { compare, hash } from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { toNextJsHandler } from "better-auth/next-js";
import { db } from "@/lib/db";
import { users, sessions, accounts, verifications } from "@/lib/schema";
import { ensureBaseUrl } from "@/lib/auth-url";

const authInstance = betterAuth({
    baseURL: ensureBaseUrl(process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL),
    trustHost: process.env.NODE_ENV === "production",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        password: {
            hash: async (password) => hash(password, 12),
            verify: async ({ hash: storedHash, password }) => compare(password, storedHash),
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    trustedOrigins: [
        ...(process.env.TRUSTED_ORIGINS?.split(",") || []),
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL ? ensureBaseUrl(process.env.NEXT_PUBLIC_APP_URL) : "",
        process.env.BETTER_AUTH_URL ? ensureBaseUrl(process.env.BETTER_AUTH_URL) : "",
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
        process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ""
    ].filter(Boolean),
    secret: process.env.AUTH_SECRET,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    account: {
        accountLinking: {
            trustedProviders: ["google"],
        },
    },
    plugins: [nextCookies()],
    advanced: {
        database: {
            generateId: () => crypto.randomUUID(),
        },
    },
});

export const handlers = toNextJsHandler(authInstance);
export const signIn = authInstance.api.signInEmail;
export const signOut = authInstance.api.signOut;
export { authInstance };

export async function auth() {
    try {
        const session = await authInstance.api.getSession({
            headers: await headers(),
        });

        if (!session) return null;

        return {
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            },
            expires: String(session.session.expiresAt),
        };
    } catch {
        return null;
    }
}
