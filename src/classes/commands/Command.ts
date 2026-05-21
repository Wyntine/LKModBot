// TODO: Complete command system.
// TODO: Current commands to be added:
// /avatar, /server, /profile, /register, /eval, /status, /ban, /kick, /clear
// src/types/command.ts
import type { CommandOptions, CommandRunner } from "../../types/commands.d.ts";
import type { Subcommand } from "./Subcommand.d.ts";
import type { SubcommandGroup } from "./SubcommandGroup.d.ts";
import { SlashCommandBuilder } from "discord.js";
import { join } from "path";

import { CommandData } from "./CommandData.ts";

export class Command extends CommandData<SlashCommandBuilder> {
  public static readonly commandsDir = join("src", "files", "commands");
  public readonly execute: CommandRunner<this>;
  protected readonly subcommands: Map<string, Subcommand> = new Map();
  protected readonly subcommandGroups: Map<string, SubcommandGroup> = new Map();

  public constructor(options: CommandOptions) {
    super({
      ...options,
      builder: options.builder ?? new SlashCommandBuilder(),
    });
    this.execute = options.execute;
  }

  public addSubcommand(subcommand: Subcommand): void {
    const name = subcommand.getName();
    const data = subcommand.getData();

    if (this.subcommands.has(name)) {
      CommandData.logger.throw("A subcommand with given name exists.");
    }

    this.updateData(
      (builder) => builder.addSubcommand(data) as SlashCommandBuilder,
    );
    this.subcommands.set(name, subcommand);
  }

  public addSubcommandGroup(subcommandGroup: SubcommandGroup): void {
    const name = subcommandGroup.getName();
    const data = subcommandGroup.getData();

    if (this.subcommandGroups.has(name)) {
      CommandData.logger.throw("A subcommand group with given name exists.");
    }

    this.updateData(
      (builder) => builder.addSubcommandGroup(data) as SlashCommandBuilder,
    );
    this.subcommandGroups.set(name, subcommandGroup);
  }
}
