/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/await-thenable */
import { db } from "~/server/db";
import {
  chatSessions,
  insertChatSessionSchema,
  insertMessageSchema,
  messages,
} from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const mainRouter = createTRPCRouter({
  getChatSessions: protectedProcedure.query(async ({ ctx }) => {
    const history = await db
      .select({ id: chatSessions.id, name: chatSessions.name })
      .from(chatSessions)
      .where(eq(chatSessions.userId, ctx.userId!))
      .orderBy(desc(chatSessions.updatedAt));

    return history.map((session) => ({
      id: session.id,
      name: session.name ?? "Untitled Session",
    }));
  }),

  createChatSession: protectedProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newChatSession = await db
        .insert(chatSessions)
        .values(
          insertChatSessionSchema.parse({
            userId: ctx.session?.user.userId,
            name: input.question.substring(0, 20),
          }),
        )
        .returning({ insertedId: chatSessions.id });

      if (!newChatSession[0]?.insertedId) return;

      // Add this message to the session
      const newMessage = await db
        .insert(messages)
        .values(
          insertMessageSchema.parse({
            sessionId: newChatSession[0].insertedId,
            role: "user",
            content: input.question,
          }),
        )
        .returning({ insertedId: messages.id });

      if (!newMessage[0]?.insertedId) return;

      const message = await db
        .select()
        .from(messages)
        .where(eq(messages.id, newMessage[0].insertedId))
        .limit(1);

      return {
        newSessionId: newChatSession[0].insertedId,
        message: message[0],
      };
    }),

  deleteChatSession: protectedProcedure
    .input(z.object({ sessionId: z.string().nullish() }))
    .mutation(async ({ input }) => {
      if (!input.sessionId) return;

      await db
        .delete(messages)
        .where(and(eq(messages.sessionId, input.sessionId)));
      await db.delete(chatSessions).where(eq(chatSessions.id, input.sessionId));
    }),

  deleteAllChatSessions: protectedProcedure.mutation(async ({ ctx }) => {
    const sessionIds = await db
      .select({ id: chatSessions.id })
      .from(chatSessions)
      .where(eq(chatSessions.userId, ctx.userId!));

    await Promise.all(
      sessionIds.map(async (session) => {
        await db.delete(messages).where(eq(messages.sessionId, session.id));
        await db.delete(chatSessions).where(eq(chatSessions.id, session.id));
      }),
    );
  }),

  getChatSessionMessages: protectedProcedure
    .input(z.object({ sessionId: z.string().nullish() }))
    .mutation(async ({ input }) => {
      if (!input.sessionId) return [];

      const history = await db
        .select()
        .from(messages)
        .where(eq(messages.sessionId, input.sessionId))
        .orderBy(asc(messages.createdAt));

      return history;
    }),

  addChatMessage: protectedProcedure
    .input(insertMessageSchema)
    .mutation(async ({ input }) => {
      await db.insert(messages).values(insertMessageSchema.parse(input));
    }),
});
