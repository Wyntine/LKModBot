import type { LogLevel, LogLevels } from "../types/logger.d.ts";
import { config, Config } from "./Config.ts";

export const logLevel = {
  DEBUG: 4,
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  OFF: 0,
} as const;

export class Logger {
  private static readonly ownTag = "Logger";
  private static maxTagLength: number = 0;
  private static tags: Set<string> = new Set();

  private tag: string;

  public constructor(tag?: string) {
    const finalTag = tag ?? "System";
    this.tag = finalTag;
    Logger.tags.add(finalTag);

    if (Logger.maxTagLength < finalTag.length) {
      Logger.maxTagLength = finalTag.length;
    }
  }

  public static convertLogLevel(level: LogLevels): LogLevel {
    switch (level) {
      case "debug":
        return logLevel.DEBUG;
      case "info":
        return logLevel.INFO;
      case "warn":
        return logLevel.WARN;
      case "error":
        return logLevel.ERROR;
      case "off":
        return logLevel.OFF;
      default:
        Logger.throw(`Invalid log level: ${level}`);
    }
  }

  public static logLevelString(level: LogLevel) {
    switch (level) {
      case logLevel.DEBUG:
        return "DEBUG";
      case logLevel.INFO:
        return "INFO";
      case logLevel.WARN:
        return "WARN";
      case logLevel.ERROR:
        return "ERROR";
      case logLevel.OFF:
        return "OFF";
      default:
        Logger.throw(`Invalid log level: ${level}`);
    }
  }

  private static formatMessage(
    tag: string,
    message: string,
    logLevel: LogLevel,
  ): string {
    const date = new Date().toLocaleString();
    const pad = " ".padEnd(Logger.maxTagLength - tag.length + 1);
    return `[${date}] [${Logger.logLevelString(logLevel)}] [${tag}]${pad}: ${message}`;
  }

  private static throw(message: string, tag = Logger.ownTag): never {
    console.error(Logger.formatMessage(tag, message, logLevel.ERROR));
    throw new Error();
  }

  // Logged with level >= 1 (LogLevel.ERROR)
  public error(message: string): void {
    const level = logLevel.ERROR;
    if (this.canLogged(level)) {
      console.error(this.formatMessage(message, level));
    }
  }

  // Logged with level > 2 (LogLevel.WARN)
  public warn(message: string): void {
    const level = logLevel.WARN;
    if (this.canLogged(level)) {
      console.warn(this.formatMessage(message, level));
    }
  }

  // Logged with level >= 3 (LogLevel.INFO)
  public info(message: string): void {
    const level = logLevel.INFO;
    if (this.canLogged(level)) {
      console.info(this.formatMessage(message, level));
    }
  }

  // Logged with level >= 4 (LogLevel.DEBUG)
  public debug(message: string): void {
    const level = logLevel.DEBUG;
    if (this.canLogged(level)) {
      console.debug(this.formatMessage(message, level));
    }
  }

  public throw(message: string): never {
    return Logger.throw(message, this.tag);
  }

  private getLogLevel(): LogLevel {
    return Config.isReady() ? config.getLogLevel() : logLevel.DEBUG;
  }

  private canLogged(level: LogLevel): boolean {
    return this.getLogLevel() >= level;
  }

  private formatMessage(message: string, logLevel: LogLevel): string {
    return Logger.formatMessage(this.tag, message, logLevel);
  }
}
