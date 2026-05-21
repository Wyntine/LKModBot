import type { LogLevel } from "../types/logger.d.ts";
import type { ClientPresence } from "../types/config.d.ts";
import type { FSWatcher } from "fs";
import type { ConfigSchema } from "../schemas/configSchema.ts";
import { readFileSync, watch } from "fs";
import { join } from "path";
import { parse } from "yaml";

import { convertPresence } from "../handlers/client.ts";
import { configSchema } from "../schemas/configSchema.ts";
import { Logger } from "./Logger.ts";

export class Config {
  private static _isReady: boolean = false;
  private static readonly logger = new Logger("Config");
  private static readonly configFileName = "config.yaml";

  private config: ConfigSchema;
  private fileWatcher: FSWatcher | null = null;
  private configFilePath: string;

  public constructor() {
    this.configFilePath = join(process.cwd(), Config.configFileName);
    this.config = this.loadConfig(true);
    Config._isReady = true;
  }

  public static isReady(): boolean {
    return Config._isReady;
  }

  public getToken(): string {
    return this.config.system.token;
  }

  public getLogLevel(): LogLevel {
    return Logger.convertLogLevel(this.config.system.logLevel);
  }

  public getPresences(): ClientPresence[] {
    return this.config.bot.presences.map(
      ({ name, type, status = "online" }) => {
        const convertedType = convertPresence(type ?? "playing");
        return { name, type: convertedType, status };
      },
    );
  }

  public getPresenceRefreshTime(): number {
    return this.config.bot.presenceRefreshTime;
  }

  public getServerId(): string {
    return this.config.system.serverId;
  }

  public getDevelopers(): string[] {
    return this.config.system.developers ?? [];
  }

  public watchConfig(): void {
    if (!this.fileWatcher) {
      this.fileWatcher = watch(this.configFilePath);
      this.fileWatcher.on("change", async () => {
        this.loadConfig();
        Config.logger.info("Config reloaded");
      });
    }
  }

  public stopWatching(): void {
    if (this.fileWatcher) {
      this.fileWatcher.removeAllListeners();
      this.fileWatcher = null;
    }
  }

  private loadConfig(firstLoad = true): ConfigSchema {
    const data = readFileSync(this.configFilePath, "utf-8");
    const loaded: unknown = parse(data);

    if (firstLoad) {
      this.config = configSchema.parse(loaded);
    }

    return this.config;
  }
}

export const config = new Config();
