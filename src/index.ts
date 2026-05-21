import { config } from "./classes/Config.ts";
import { client, clientLogger } from "./handlers/client.ts";
import { reloadCommands } from "./handlers/command.ts";
import { reloadEvents } from "./handlers/events.ts";

await reloadEvents();
await reloadCommands();
await client.login(config.getToken());

let isShuttingDown = false;

process.on("SIGINT", async () => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  clientLogger.info("Shutting down the bot...");

  try {
    if (client.readyTimestamp) {
      await client.destroy();
    }
  } catch (err) {
    clientLogger.error("Unknown error occured while shutting down:", err);
  }

  process.exit(0);
});
