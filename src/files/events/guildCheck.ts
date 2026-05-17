import { config } from "../../classes/Config.ts";
import { Event } from "../../classes/Event.ts";
import { clientLogger } from "../../handlers/client.ts";

export default new Event({
  name: "guildCheck",
  category: "guildCreate",
  async execute(guild) {
    if (guild.id === config.getServerId()) {
      return;
    }

    await guild.leave();
    clientLogger.info(`Left from guild '${guild.name}'.`);
  },
});
