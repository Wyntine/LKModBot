import type { ActivityType, PresenceStatusData } from "discord.js";

export interface ClientPresence {
  name: string;
  type: ActivityType;
  status: PresenceStatusData;
}
