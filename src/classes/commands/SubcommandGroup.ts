import type { Subcommand } from "./Subcommand.d.ts";
import type {
  CommandRunner,
  SubcommandGroupOptions,
} from "../../types/commands.d.ts";
import { SlashCommandSubcommandGroupBuilder } from "discord.js";

import { CommandData } from "./CommandData.ts";

export class SubcommandGroup extends CommandData<SlashCommandSubcommandGroupBuilder> {
  protected readonly subcommands: Map<string, Subcommand> = new Map();

  public constructor(options: SubcommandGroupOptions) {
    super({
      ...options,
      builder: options.builder ?? new SlashCommandSubcommandGroupBuilder(),
    });
  }

  public addSubcommand(subcommand: Subcommand): void {
    const name = subcommand.getName();
    const data = subcommand.getData();

    if (this.subcommands.has(name)) {
      CommandData.logger.throw("A subcommand with given name exists.");
    }

    this.updateData(
      (builder) =>
        builder.addSubcommand(data) as SlashCommandSubcommandGroupBuilder,
    );
    this.subcommands.set(name, subcommand);
  }

  public execute: CommandRunner<this> = (interaction) => {
    const subcommandName = interaction.options.getSubcommand(true);
    const subcommand = this.subcommands.get(subcommandName);

    if (!subcommand) {
      CommandData.logger.throw(
        "Given subcommand from subcommand does not exist.",
      );
    }

    subcommand.execute(interaction);
  };
}
