import type { ClientPresence } from "../types/config.d.ts";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";

import { config } from "../classes/Config.ts";
import { Logger } from "../classes/Logger.ts";

export const availableStatuses = ["idle", "dnd", "online"] as const;

export const clientLogger = new Logger("Client");

let presenceIndex = -1;
let presenceInterval: NodeJS.Timeout | null;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

function getNextPresence(): ClientPresence {
  const presences = config.getPresences();
  presenceIndex = (presenceIndex + 1) % presences.length;
  return presences[presenceIndex] as ClientPresence;
}

async function updatePresence() {
  const { status, ...presence } = getNextPresence();

  client.user?.setPresence({
    status,
    activities: [{ ...presence, url: "https://www.twitch.tv/lofigirl" }],
  });
}

export async function checkForNewServerJoins() {
  const serverId = config.getServerId();

  for (const [id, guild] of client.guilds.cache) {
    if (id !== serverId) {
      await guild.leave();
      clientLogger.info(`Left from guild '${guild.name}' (Start-up check).`);
    }
  }
}

export async function startPresenceLoop() {
  const refreshTime = config.getPresenceRefreshTime();
  updatePresence();
  presenceInterval = setInterval(updatePresence, refreshTime);
}

export function stopPresenceLoop() {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceIndex = -1;
    presenceInterval = null;
  }
}

export function convertPresence(type: string): ActivityType {
  switch (type) {
    case "playing":
      return ActivityType.Playing;
    case "streaming":
      return ActivityType.Streaming;
    case "listening":
      return ActivityType.Listening;
    case "watching":
      return ActivityType.Watching;
    case "custom":
      return ActivityType.Custom;
    case "competing":
      return ActivityType.Competing;
    default:
      return clientLogger.throw(`Given activity type '${type}' is invalid.`);
  }
}
