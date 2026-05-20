import { Event } from "../../classes/Event.ts";
import {
  checkForNewServerJoins,
  startPresenceLoop,
} from "../../handlers/client.ts";
import { registerCommands } from "../../handlers/command.ts";

export default new Event({
  name: "startup",
  once: true,
  category: "clientReady",
  async execute(client) {
    await registerCommands(client);
    await checkForNewServerJoins();
    this.logger.info(`${client.user.username} is ready!`);
    startPresenceLoop();
    // TODO: Connect to the sound channel on start up. Add it to config.
  },
});
