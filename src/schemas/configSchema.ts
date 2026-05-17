import z from "zod";
import { availableStatuses } from "../handlers/client.ts";

export type ConfigSchema = z.infer<typeof configSchema>;

export const configSchema = z.object({
  system: z.object(
    {
      serverId: z.string(),
      token: z.string("Bot token is missing."),
      logLevel: z.enum(
        ["off", "debug", "warn", "error"],
        "Log level is missing or invalid.",
      ),
      developers: z.array(z.string()).optional(),
    },
    "System data is missing.",
  ),
  bot: z.object(
    {
      presenceRefreshTime: z.number().min(1000),
      presences: z.array(
        z.object({
          name: z.string(),
          status: z.enum(availableStatuses).optional(),
          type: z
            .enum([
              "playing",
              "streaming",
              "listening",
              "watching",
              "custom",
              "competing",
            ])
            .optional(),
        }),
      ),
    },
    "Bot data is missing.",
  ),
});
