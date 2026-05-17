import { config } from "./classes/Config.ts";
import { client } from "./handlers/client.ts";
import { reloadEvents } from "./handlers/events.ts";

await reloadEvents();
await client.login(config.getToken());

// TODO: client.destroy() errors with "Shard 0 not found"
// process.on("SIGINT", async () => {
//   await client.destroy();
// });
