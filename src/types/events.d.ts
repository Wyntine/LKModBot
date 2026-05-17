import { ClientEvents } from "discord.js";
import type { MaybePromise } from "./utils.js";
import type { Event } from "../classes/Event.ts";

export interface EventOptions<Category extends Events> {
  name: string;
  once?: boolean;
  category: Category;
  execute: EventRunner<Category>;
}

export type EventRunner<Category extends Events> = (
  this: Event<Category>,
  ...args: ClientEvents[Category]
) => MaybePromise<unknown>;

export type VoidEventRunner<Category extends Events> = (
  ...args: ClientEvents[Category]
) => void;

export type Events = keyof ClientEvents;
