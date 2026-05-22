import { relations, sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { portfolios } from "./portfolios";
import { users } from "./users";

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    portfolioId: uuid("portfolio_id").references(() => portfolios.id, { onDelete: "cascade" }),
    isEnabled: boolean("is_enabled").notNull().default(false),
    model: varchar("model", { length: 80 }).notNull(),
    behaviorType: varchar("behavior_type", { length: 40 }),
    strategyMode: varchar("strategy_mode", { length: 20 }).notNull().default("consultative"),
    customPrompt: text("custom_prompt"),
    temperature: real("temperature").notNull().default(0.5),
    displayName: varchar("display_name", { length: 80 }),
    avatarUrl: text("avatar_url"),
    intro: text("intro"),
    roleLabel: varchar("role_label", { length: 60 }),
    notificationEmail: varchar("notification_email", { length: 255 }),
    googleCalendarEnabled: boolean("google_calendar_enabled").notNull().default(false),
    googleCalendarAccessToken: text("google_calendar_access_token"),
    googleCalendarRefreshToken: text("google_calendar_refresh_token"),
    googleCalendarTokenExpiry: timestamp("google_calendar_token_expiry", { mode: "date" }),
    googleCalendarAccountEmail: varchar("google_calendar_account_email", { length: 255 }),
    calendlyEnabled: boolean("calendly_enabled").notNull().default(false),
    calendlyAccessToken: text("calendly_access_token"),
    calendlyRefreshToken: text("calendly_refresh_token"),
    calendlyTokenExpiry: timestamp("calendly_token_expiry", { mode: "date" }),
    calendlyAccountEmail: varchar("calendly_account_email", { length: 255 }),
    calendlyUserUri: varchar("calendly_user_uri", { length: 255 }),
    calendlySchedulingUrl: text("calendly_scheduling_url"),
    leadEnrichmentEnabled: boolean("lead_enrichment_enabled").notNull().default(false),
    workingHours: jsonb("working_hours").$type<
      { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[]
    >(),
    offDays: jsonb("off_days").$type<string[]>(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    unique("agents_portfolio_id_unique_constraint").on(table.portfolioId),
    uniqueIndex("agents_portfolio_id_unique").on(table.portfolioId),
    index("agents_user_id_idx").on(table.userId),
    index("agents_user_portfolio_lookup_idx").on(table.userId, table.portfolioId),
    index("agents_portfolio_id_idx").on(table.portfolioId),
    check("agents_temperature_range_check", sql`${table.temperature} BETWEEN 0.2 AND 0.8`),
    check(
      "agents_strategy_mode_check",
      sql`${table.strategyMode} IN ('passive', 'consultative', 'sales')`
    ),
  ]
);

export const knowledgeSources = pgTable(
  "knowledge_sources",
  {
    id: uuid("id").primaryKey(),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 160 }).notNull(),
    type: varchar("type", { length: 20 }).notNull().default("text"),
    content: text("content").notNull(),
    fileUrl: text("file_url"),
    fileSize: integer("file_size"),
    mimeType: varchar("mime_type", { length: 50 }),
    status: varchar("status", { length: 20 }).notNull().default("complete"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("knowledge_sources_agent_id_idx").on(table.agentId),
    index("knowledge_sources_status_idx").on(table.status),
    check("knowledge_sources_type_check", sql`${table.type} IN ('text', 'pdf')`),
    check(
      "knowledge_sources_status_check",
      sql`${table.status} IN ('pending', 'processing', 'complete', 'failed')`
    ),
  ]
);

export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id: uuid("id").primaryKey(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => knowledgeSources.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    chunkText: text("chunk_text").notNull(),
    embedding: text("embedding"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("knowledge_chunks_agent_id_idx").on(table.agentId),
    index("knowledge_chunks_source_id_idx").on(table.sourceId),
  ]
);

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  portfolio: one(portfolios, {
    fields: [agents.portfolioId],
    references: [portfolios.id],
  }),
  knowledgeSources: many(knowledgeSources),
  knowledgeChunks: many(knowledgeChunks),
}));

export const knowledgeSourcesRelations = relations(knowledgeSources, ({ one, many }) => ({
  agent: one(agents, {
    fields: [knowledgeSources.agentId],
    references: [agents.id],
  }),
  chunks: many(knowledgeChunks),
}));

export const knowledgeChunksRelations = relations(knowledgeChunks, ({ one }) => ({
  source: one(knowledgeSources, {
    fields: [knowledgeChunks.sourceId],
    references: [knowledgeSources.id],
  }),
  agent: one(agents, {
    fields: [knowledgeChunks.agentId],
    references: [agents.id],
  }),
}));

export type Agent = InferSelectModel<typeof agents>;
export type NewAgent = InferInsertModel<typeof agents>;
export type KnowledgeSource = InferSelectModel<typeof knowledgeSources>;
export type NewKnowledgeSource = InferInsertModel<typeof knowledgeSources>;
export type KnowledgeChunk = InferSelectModel<typeof knowledgeChunks>;
export type NewKnowledgeChunk = InferInsertModel<typeof knowledgeChunks>;
