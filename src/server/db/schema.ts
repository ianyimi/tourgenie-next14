import type { TripDetails } from "~/state/plan";
import type { Destination, DestinationSummary } from "~/state/trip";
import type { UserDetails } from "~/state/user";
import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import {
  bigserial,
  boolean,
  json,
  integer,
  primaryKey,
  pgTable,
  text,
  timestamp,
  bigint,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tableNames = {
  user: "user",
  session: "user-session",
  key: "user-key",
};

export const trips = pgTable("trip", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  summary: json("summary").$type<DestinationSummary>(),
  itinerary: json("itinerary").$type<Destination>(),
  departureDate: integer("departureDate"),
  returnDate: integer("returnDate"),
  duration: integer("duration"),
  chatSessionId: text("chatSessionId").references(() => chatSessions.id, {
    onDelete: "set null",
  }),
  messageHistory: json("messageHistory").$type<Message[]>(),
  plan: json("plan").$type<TripDetails>(),
  purpose: text("purpose"),
});
export const tripRelations = relations(trips, ({ one }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
}));
export type Trip = InferSelectModel<typeof trips>;
export type NewTrip = InferInsertModel<typeof trips>;
export const insertTripSchema = createInsertSchema(trips);
export const selectTripSchema = createSelectSchema(trips);

export const users = pgTable(tableNames.user, {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email"),
  emailVerified: boolean("emailVerified"),
  locale: varchar("locale"),
  picture: text("picture"),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  subscriptionTier: text("subscriptionTier", {
    enum: ["Free", "Premium"],
  }).default("Free"),
  tripIds: json("tripIds").$type<string[]>(),
  travelPreferences:
    json("travelPreferences").$type<UserDetails["travelPreferences"]>(),
  personalInfo: json("personalInfo").$type<UserDetails["personalInfo"]>(),
});
export const userRelations = relations(users, ({ many }) => ({
  trips: many(trips),
  sessions: many(sessions),
  keys: many(keys),
}));
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);

export const sessions = pgTable(tableNames.session, {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  activeExpires: bigint("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "bigint",
  }).notNull(),
});
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type NewVerificationToken = InferInsertModel<typeof verificationTokens>;
export const insertVerificationTokenSchema =
  createInsertSchema(verificationTokens);
export const selectVerificationTokenSchema =
  createSelectSchema(verificationTokens);

export const keys = pgTable(tableNames.key, {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  hashedPassword: text("hashed_password"),
});
export type Key = InferSelectModel<typeof keys>;
export type NewKey = InferInsertModel<typeof keys>;
export const insertKeySchema = createInsertSchema(keys);
export const selectKeySchema = createSelectSchema(keys);

export const keysRelations = relations(keys, ({ one }) => ({
  user: one(users, {
    fields: [keys.userId],
    references: [users.id],
  }),
}));

export const chatSessions = pgTable("chatSessions", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});
export type ChatSession = InferSelectModel<typeof chatSessions>;
export type NewChatSession = InferInsertModel<typeof chatSessions>;
export const insertChatSessionSchema = createInsertSchema(chatSessions);
export const selectChatSessionSchema = createSelectSchema(chatSessions);

export const messages = pgTable("messages", {
  id: text("id").notNull().primaryKey(),
  content: text("content"),
  sessionId: text("sessionId").references(() => chatSessions.id, {
    onDelete: "no action",
  }),
  createdAt: timestamp("created_at").default(sql`now()`),
  role: text("role", { enum: ["user", "bot"] }),
});
export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export const cities = pgTable("city", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  countryCode: text("countryCode").notNull(),
  population: integer("population"),
  latitude: integer("latitude").notNull(),
  longitude: integer("longitude").notNull(),
});

export type City = InferSelectModel<typeof cities>;
export type NewCity = InferInsertModel<typeof cities>;
export const insertCitySchema = createInsertSchema(cities);
export const selectCitySchema = createSelectSchema(cities);
