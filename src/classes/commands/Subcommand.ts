import type {
  CommandRunner,
  SubcommandOptions,
} from "../../types/commands.d.ts";
import { SlashCommandSubcommandBuilder } from "discord.js";

import { CommandData } from "./CommandData.ts";

export class Subcommand extends CommandData<SlashCommandSubcommandBuilder> {
  public readonly execute: CommandRunner<this>;

  public constructor(options: SubcommandOptions) {
    super({
      ...options,
      builder: options.builder ?? new SlashCommandSubcommandBuilder(),
    });
    this.execute = options.execute;
  }
}
