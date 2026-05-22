import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { desc, eq } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { leads, users } from "@/lib/schema";

export interface Profile {
  id: string;
  name: string;
  plan: "free" | "pro" | "business";
  credits: number;
  email: string;
  image?: string | null;
  billingCustomerId?: string | null;
  billingSubscriptionId?: string | null;
}

export interface Lead {
  name?: string;
  email?: string;
  company?: string;
}

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

const databaseUrl = process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/postgres";

function shouldRequireSsl(connectionString: string) {
  try {
    const hostname = new URL(connectionString).hostname;
    return hostname !== "127.0.0.1" && hostname !== "localhost";
  } catch {
    return true;
  }
}

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL is not set; using fallback local connection string for build/dev checks.");
}

const sql = globalForDb.sql ?? postgres(databaseUrl, {
  prepare: false,
  ssl: shouldRequireSsl(databaseUrl) ? "require" : undefined,
  connect_timeout: 30,
  idle_timeout: 20,    // 20s: long enough to reuse connections, short enough to avoid stale pooler sockets
  max_lifetime: 60 * 5, // 5 minutes
  onnotice: () => { }, // Silence notices
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export const db = drizzle(sql, { schema });

/**
 * Executes a database operation with retry logic for transient errors.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 100
): Promise<T> {
  let lastError: Error | unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      const errorCode = (error as { code?: string })?.code;
      const errorMessage = (error as { message?: string })?.message;
      const errorSeverity = (error as { severity?: string })?.severity;
      const errorCauseCode = (error as { cause?: { code?: string } })?.cause?.code;

      const isTransient =
        errorCode === 'ECONNRESET' ||
        errorCode === 'CONNECT_TIMEOUT' ||
        errorCauseCode === 'CONNECT_TIMEOUT' ||
        errorMessage?.includes('ECONNRESET') ||
        errorMessage?.includes('read ECONNRESET') ||
        errorMessage?.includes('CONNECT_TIMEOUT') ||
        errorSeverity === 'FATAL';

      if (!isTransient || i === maxRetries - 1) {
        throw error;
      }

      console.warn(`Database query failed (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`, (error as Error).message);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw lastError;
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      plan: users.plan,
      credits: users.credits,
      image: users.image,
      billingCustomerId: users.billingCustomerId,
      billingSubscriptionId: users.billingSubscriptionId,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) {
    return null;
  }

  return {
    ...user,
    name: user.name ?? "User",
    plan: user.plan as "free" | "pro" | "business",
  };
}

export async function saveLead(
  lead: Required<Pick<Lead, "email">> & Lead,
  userId: string
): Promise<void> {
  await db.insert(leads).values({
    id: crypto.randomUUID(),
    email: lead.email,
    name: lead.name ?? null,
    company: lead.company ?? null,
    userId,
  });
}

export async function getLeads(userId: string) {
  return db
    .select()
    .from(leads)
    .where(eq(leads.userId, userId))
    .orderBy(desc(leads.createdAt));
}
