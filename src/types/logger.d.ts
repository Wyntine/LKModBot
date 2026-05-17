import { logLevel } from "../classes/Logger.ts";

export type LogLevels = Lowercase<keyof typeof logLevel>;
export type LogLevel = (typeof logLevel)[Uppercase<LogLevels>];
