import { relations, sql } from "drizzle-orm";
import * as schema from "../schema";

export const kbSourcesRelations = relations(schema.kbSources, ({ one }) => ({
  user: one(schema.users, {
    fields: [schema.kbSources.userId],
    references: [schema.users.id],
  }),
  chatbot: one(schema.chatbots, {
    fields: [schema.kbSources.chatbotId],
    references: [schema.chatbots.id],
  }),
}));
