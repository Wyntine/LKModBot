import { join } from "path";
import { Event } from "../classes/Event.ts";
import { Logger } from "../classes/Logger.ts";
import { isTypeScriptFile } from "../utils/fileUtils.ts";
import { client } from "./client.ts";
import { readdir } from "fs/promises";

const logger = new Logger("Events");
const events: Event[] = [];

export async function reloadEvents() {
  for (let index = events.length - 1; index > 0; index--) {
    const event = events[index] as Event;
    client.removeListener(...event.createListenerArgs());
    events.pop();
  }

  const files = await readdir(Event.eventsDir, {
    withFileTypes: true,
    recursive: true,
    encoding: "utf-8",
  });

  for (const file of files) {
    if (!file.isFile()) {
      continue;
    }

    const eventPath = join(file.parentPath, file.name);

    if (!isTypeScriptFile(file.name)) {
      logger.warn(`File '${eventPath}' is not a TypeScript file.`);
    }

    try {
      const importPath = join("..", "..", eventPath);
      const fileImport = await import(importPath);

      if (
        !("default" in fileImport) ||
        !(fileImport.default instanceof Event)
      ) {
        logger.error(`File '${eventPath}' does not have correct Event export.`);
        continue;
      }

      const event = fileImport.default as Event;
      event.setFileName(file.name);

      const listen = (event.once ? client.once : client.on).bind(client);
      listen(...event.createListenerArgs());
      events.push(event);
    } catch (error) {
      console.error(error);
      logger.error(
        `Unknown error occured while trying to import '${eventPath}'`,
      );
    }
  }
}
