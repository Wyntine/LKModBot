import type {
  EventOptions,
  Events,
  VoidEventRunner,
} from "../types/events.d.ts";
import { Logger } from "./Logger.ts";
import { join } from "path";

export class Event<Category extends Events = Events> {
  public static eventsDir: string = join("src", "files", "events");
  private static logger: Logger = new Logger("Event");

  public readonly name: string;
  public readonly once: boolean;
  public readonly execute: VoidEventRunner<Category>;
  public readonly category: Category;
  public readonly logger: Logger = Event.logger;

  private fileName?: string;

  constructor(options: EventOptions<Category>) {
    this.name = options.name;
    this.once = options.once || false;
    this.category = options.category;
    this.execute = (...args) => {
      options.execute.bind(this)(...args);
    };
  }

  public createListenerArgs() {
    return [this.category, this.execute] as const;
  }

  public setFileName(fileName: string) {
    if (!fileName.endsWith(".ts")) {
      Event.logger.throw("File name must end with .ts");
    }

    if (this.fileName) {
      Event.logger.throw("File name cannot be changed after setting");
    }

    if (!fileName.length) {
      Event.logger.throw("File name cannot be empty");
    }

    this.fileName = fileName;
  }

  public getFileName() {
    if (!this.fileName) {
      Event.logger.throw("File name is not set");
    }

    return this.fileName;
  }
}
