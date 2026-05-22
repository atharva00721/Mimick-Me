import { relations, sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

import { agents } from "./agents";
import { portfolios } from "./portfolios";
import { users } from "./users";

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  company: text("company"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const agentLeads = pgTable(
  "agent_leads",
  {
    id: uuid("id").primaryKey(),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    portfolioId: uuid("portfolio_id").references(() => portfolios.id, { onDelete: "cascade" }),
    name: text("name"),
    email: text("email"),
    budget: text("budget"),
    projectDetails: text("project_details"),
    phone: text("phone"),
    website: text("website"),
    meetingTime: text("meeting_time"),
    captureTurn: integer("capture_turn"),
    conversationSummary: text("conversation_summary"),
    status: varchar("status", { length: 20 })
      .$type<"new" | "contacted" | "closed">()
      .notNull()
      .default("new"),
    isRead: boolean("is_read").notNull().default(false),
    confidence: real("confidence").notNull(),
    sessionId: uuid("session_id"),
    notificationSent: boolean("notification_sent").notNull().default(false),
    enrichment: jsonb("enrichment").$type<any>(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    check("agent_leads_status_check", sql`${table.status} IN ('new', 'contacted', 'closed')`),
  ]
);

export const leadChatMessages = pgTable(
  "lead_chat_messages",
  {
    id: uuid("id").primaryKey(),
    leadId: uuid("lead_id").references(() => agentLeads.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").notNull(),
    role: varchar("role", { length: 20 }).$type<"user" | "assistant">().notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("lead_chat_messages_session_id_idx").on(table.sessionId),
    index("lead_chat_messages_lead_id_idx").on(table.leadId),
  ]
);

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, {
    fields: [leads.userId],
    references: [users.id],
  }),
}));

export const agentLeadsRelations = relations(agentLeads, ({ one, many }) => ({
  agent: one(agents, {
    fields: [agentLeads.agentId],
    references: [agents.id],
  }),
  portfolio: one(portfolios, {
    fields: [agentLeads.portfolioId],
    references: [portfolios.id],
  }),
  messages: many(leadChatMessages),
}));

export const leadChatMessagesRelations = relations(leadChatMessages, ({ one }) => ({
  lead: one(agentLeads, {
    fields: [leadChatMessages.leadId],
    references: [agentLeads.id],
  }),
}));

export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;
export type AgentLead = InferSelectModel<typeof agentLeads>;
export type NewAgentLead = InferInsertModel<typeof agentLeads>;
export type LeadChatMessage = InferSelectModel<typeof leadChatMessages>;
export type NewLeadChatMessage = InferInsertModel<typeof leadChatMessages>;
