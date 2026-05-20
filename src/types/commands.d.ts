import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import type { MaybePromise } from "./utils.js";
import type { Command } from "../classes/commands/Command.ts";
import type { Subcommand } from "../classes/commands/Subcommand.ts";
import type { SubcommandGroup } from "../classes/commands/SubcommandGroup.ts";
import type { Options } from "../classes/commands/Options.ts";

export type CommandBuilderTypes =
  | SlashCommandBuilder
  | SlashCommandSubcommandGroupBuilder
  | SlashCommandSubcommandBuilder;

export type CommandTypes = Command | Subcommand | SubcommandGroup;

export type BaseCommandRunner = (
  interaction: ChatInputCommandInteraction,
) => MaybePromise<unknown>;

export type CommandRunner<Command extends CommandTypes> = (
  this: Command,
  interaction: ChatInputCommandInteraction,
) => MaybePromise<unknown>;

export interface CommandDataOptions<Type extends CommandBuilderTypes> {
  builder: Type;
  options: OptionsData | Options;
}

export interface CommandOptions extends CommandDataOptions<SlashCommandBuilder> {
  execute: CommandRunner<Command>;
  builder?: SlashCommandBuilder;
}

export interface SubcommandOptions extends CommandDataOptions<SlashCommandSubcommandBuilder> {
  execute: CommandRunner<Subcommand>;
  builder?: SlashCommandSubcommandBuilder;
}

export interface SubcommandGroupOptions extends CommandDataOptions<SlashCommandSubcommandGroupBuilder> {
  builder?: SlashCommandSubcommandGroupBuilder;
}

export interface OptionsData {
  description: string;
  devOnly?: boolean;
  cooldown?: number;
}
