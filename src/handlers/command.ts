import type { Client } from "discord.js";
import { Command } from "../classes/commands/Command.ts";
import { Logger } from "../classes/Logger.ts";
import { readdir } from "fs/promises";
import { join } from "path";
import { CommandData } from "../classes/commands/CommandData.ts";
import { SubcommandGroup } from "../classes/commands/SubcommandGroup.ts";
import { isTypeScriptFile } from "../utils/fileUtils.ts";
import { existsSync, type Dirent } from "fs";
import { Subcommand } from "../classes/commands/Subcommand.ts";
import { Options } from "../classes/commands/Options.ts";

const logger = new Logger("Commands");
const commands: Map<string, Command> = new Map();

export function getCommand(commandName: string): Command | undefined {
  return commands.get(commandName);
}

export async function reloadCommands(): Promise<void> {
  commands.clear();

  const dir = Command.commandsDir;
  const files = await readdir(dir, { withFileTypes: true, encoding: "utf-8" });

  for (const file of files) {
    const newPath = join(dir, file.name);

    if (file.isDirectory()) {
      const options = await readOptions(newPath);

      if (!options) {
        continue;
      }

      const command = new Command({
        options,
        async execute(interaction) {
          const subcommandName = interaction.options.getSubcommand(false);
          const subcommandGroupName =
            interaction.options.getSubcommandGroup(false);

          const subcommand = subcommandName
            ? this.subcommands.get(subcommandName)
            : undefined;

          const subcommandGroup = subcommandGroupName
            ? this.subcommandGroups.get(subcommandGroupName)
            : undefined;

          if (!subcommand && !subcommandGroup) {
            CommandData.logger.throw(
              "Given subcommand/subcommand group from the command does not exist.",
            );
          }

          subcommandGroup
            ? subcommandGroup.execute(interaction)
            : subcommand?.execute(interaction);
        },
      });

      command.setName(file.name);
      await readSubcommandOnlyCommand(command, newPath);
      commands.set(command.getName(), command);
    } else if (file.isFile()) {
      const command = await readCommand(file);

      if (command) {
        commands.set(command.getName(), command);
      }
    } else {
      logger.error(`Given file '${newPath}' is invalid.`);
    }
  }
}

async function readOptions(optionsDir: string): Promise<Options | undefined> {
  const optionsPath = join(optionsDir, "_data.ts");

  if (!existsSync(optionsPath)) {
    logger.error(
      `Options file '${optionsPath}' is missing for command '${optionsDir}'.`,
    );
    return;
  }

  const importPath = join("..", "..", optionsPath);
  const fileImport = await import(importPath);

  if (!("default" in fileImport) || !(fileImport.default instanceof Options)) {
    logger.error(`File '${optionsPath}' does not have correct Options export.`);
    return;
  }

  return fileImport.default as Options;
}

async function readCommand(commandFile: Dirent): Promise<Command | undefined> {
  const commandPath = join(commandFile.parentPath, commandFile.name);

  if (!isTypeScriptFile(commandFile.name)) {
    logger.error(`File '${commandPath}' is not a TypeScript file.`);
    return;
  }

  const importPath = join("..", "..", commandPath);
  const fileImport = await import(importPath);

  if (!("default" in fileImport) || !(fileImport.default instanceof Command)) {
    logger.error(`File '${commandPath}' does not have correct Command export.`);
    return;
  }

  const command = fileImport.default as Command;
  command.setName(commandFile.name);
  return command;
}

async function readSubcommandOnlyCommand(
  command: Command,
  commandDir: string,
): Promise<void> {
  const files = await readdir(commandDir, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  for (const file of files.filter((file) => file.name !== "_data.ts")) {
    const commandPath = join(file.parentPath, file.name);

    if (file.isDirectory()) {
      const options = await readOptions(commandPath);

      if (!options) {
        continue;
      }

      command.options.fillInto(options);
      const subcommandGroup = new SubcommandGroup({ options });

      subcommandGroup.setName(file.name);
      await readSubcommandGroup(subcommandGroup, commandPath);
      command.addSubcommandGroup(subcommandGroup);
    } else if (file.isFile()) {
      await readSubcommand(command, file);
    } else {
      logger.error(`Given file '${commandPath}' is invalid.`);
    }
  }
}

async function readSubcommand(
  command: Command | SubcommandGroup,
  subcommandFile: Dirent,
): Promise<void> {
  const subcommandPath = join(subcommandFile.parentPath, subcommandFile.name);

  if (!isTypeScriptFile(subcommandFile.name)) {
    logger.error(`File '${subcommandPath}' is not a TypeScript file.`);
    return;
  }

  const importPath = join("..", "..", subcommandPath);
  const fileImport = await import(importPath);

  if (
    !("default" in fileImport) ||
    !(fileImport.default instanceof Subcommand)
  ) {
    logger.error(
      `File '${subcommandPath}' does not have correct Subcommand export.`,
    );
    return;
  }

  const subcommand = fileImport.default as Subcommand;
  subcommand.setName(subcommandFile.name);
  command.options.fillInto(subcommand.options);
  command.addSubcommand(subcommand);
}

async function readSubcommandGroup(
  subcommandGroup: SubcommandGroup,
  subcommandGroupDir: string,
): Promise<void> {
  const files = await readdir(subcommandGroupDir, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  for (const file of files.filter((file) => file.name !== "_data.ts")) {
    const subcommandPath = join(file.parentPath, file.name);

    if (file.isFile()) {
      await readSubcommand(subcommandGroup, file);
    } else {
      logger.error(`Given file '${subcommandPath}' is invalid.`);
    }
  }
}

export async function registerCommands(client: Client<true>): Promise<void> {
  const slashCommands = commands
    .values()
    .toArray()
    .map((command) => command.getData());
  await client.application.commands.set(slashCommands);
}
