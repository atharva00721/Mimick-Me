import { relations, sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { type OnboardingData } from "../onboarding/types";
import { type PortfolioContent } from "../validation/portfolio-schema";
import { users } from "./users";

export const portfolios = pgTable(
  "portfolios",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull().default("My Portfolio"),
    handle: varchar("handle", { length: 30 }).notNull(),
    subdomain: varchar("subdomain", { length: 30 }),
    onboardingData: jsonb("onboarding_data").notNull().$type<OnboardingData>(),
    content: jsonb("content").$type<PortfolioContent>(),
    template: varchar("template", { length: 30 }).notNull().default("modern"),
    theme: varchar("theme", { length: 30 }).notNull().default("minimal"),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    unique("portfolios_handle_unique_constraint").on(table.handle),
    unique("portfolios_subdomain_unique_constraint").on(table.subdomain),
    uniqueIndex("portfolios_handle_unique").on(table.handle),
    uniqueIndex("portfolios_subdomain_unique").on(table.subdomain),
    index("portfolios_user_id_idx").on(table.userId),
    check("portfolios_handle_format_check", sql`${table.handle} ~ '^[a-z0-9-]{3,30}$'`),
    check(
      "portfolios_subdomain_format_check",
      sql`${table.subdomain} IS NULL OR ${table.subdomain} ~ '^[a-z0-9-]{3,30}$'`
    ),
  ]
);

export const portfolioAnalytics = pgTable(
  "portfolio_analytics",
  {
    id: uuid("id").primaryKey(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 20 }).notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    country: varchar("country", { length: 2 }),
    sessionId: uuid("session_id"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("portfolio_analytics_portfolio_id_idx").on(table.portfolioId),
    index("portfolio_analytics_created_at_idx").on(table.createdAt),
    check("portfolio_analytics_type_check", sql`${table.type} IN ('page_view', 'chat_session_start', 'chat_message')`),
  ]
);

export const aiTelemetryEvents = pgTable(
  "ai_telemetry_events",
  {
    id: uuid("id").primaryKey(),
    handle: varchar("handle", { length: 255 }),
    agentId: uuid("agent_id"),
    portfolioId: uuid("portfolio_id").references(() => portfolios.id, { onDelete: "set null" }),
    sessionId: uuid("session_id"),
    eventType: varchar("event_type", { length: 64 }).notNull(),
    model: varchar("model", { length: 120 }),
    mode: varchar("mode", { length: 32 }),
    tokensUsed: integer("tokens_used").notNull().default(0),
    leadDetected: boolean("lead_detected").notNull().default(false),
    success: boolean("success").notNull().default(true),
    fallbackReason: varchar("fallback_reason", { length: 255 }),
    latencyMs: integer("latency_ms"),
    latencyBucket: varchar("latency_bucket", { length: 32 }),
    creditCost: integer("credit_cost").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("ai_telemetry_events_event_type_idx").on(table.eventType),
    index("ai_telemetry_events_created_at_idx").on(table.createdAt),
    index("ai_telemetry_events_handle_idx").on(table.handle),
    index("ai_telemetry_events_session_id_idx").on(table.sessionId),
    index("ai_telemetry_events_model_mode_idx").on(table.model, table.mode),
  ]
);

export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: uuid("id").primaryKey(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id"),
    leadScore: integer("lead_score"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("chat_sessions_portfolio_id_idx").on(table.portfolioId)]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).$type<"user" | "assistant">().notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("chat_messages_session_id_idx").on(table.sessionId),
    index("chat_messages_created_at_idx").on(table.createdAt),
  ]
);

export const conversionInsights = pgTable(
  "conversion_insights",
  {
    id: uuid("id").primaryKey(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    generatedAt: timestamp("generated_at", { mode: "date" }).notNull().defaultNow(),
    insightJson: jsonb("insight_json").notNull(),
    summaryText: text("summary_text"),
  },
  (table) => [
    index("conversion_insights_portfolio_id_idx").on(table.portfolioId),
    index("conversion_insights_generated_at_idx").on(table.generatedAt),
  ]
);

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  analytics: many(portfolioAnalytics),
  chatSessions: many(chatSessions),
  conversionInsights: many(conversionInsights),
}));

export const portfolioAnalyticsRelations = relations(portfolioAnalytics, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioAnalytics.portfolioId],
    references: [portfolios.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  portfolio: one(portfolios, {
    fields: [chatSessions.portfolioId],
    references: [portfolios.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

export const conversionInsightsRelations = relations(conversionInsights, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [conversionInsights.portfolioId],
    references: [portfolios.id],
  }),
}));

export type Portfolio = InferSelectModel<typeof portfolios>;
export type NewPortfolio = InferInsertModel<typeof portfolios>;
export type PortfolioAnalytic = InferSelectModel<typeof portfolioAnalytics>;
export type NewPortfolioAnalytic = InferInsertModel<typeof portfolioAnalytics>;
export type AITelemetryEvent = InferSelectModel<typeof aiTelemetryEvents>;
export type NewAITelemetryEvent = InferInsertModel<typeof aiTelemetryEvents>;
export type ChatSession = InferSelectModel<typeof chatSessions>;
export type NewChatSession = InferInsertModel<typeof chatSessions>;
export type ChatMessage = InferSelectModel<typeof chatMessages>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;
export type ConversionInsight = InferSelectModel<typeof conversionInsights>;
export type NewConversionInsight = InferInsertModel<typeof conversionInsights>;
