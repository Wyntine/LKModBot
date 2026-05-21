import type { MaybePromise } from "./utils.d.ts";
import type { Event } from "../classes/Event.d.ts";
import type { ClientEvents } from "discord.js";

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
