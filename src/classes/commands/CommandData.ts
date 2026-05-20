import { basename, extname } from "path";
import type {
  CommandDataOptions,
  CommandBuilderTypes,
  BaseCommandRunner,
} from "../../types/commands.js";
import { Logger } from "../Logger.ts";

export abstract class CommandData<Type extends CommandBuilderTypes> {
  public static readonly logger: Logger = new Logger("Command");

  public readonly devOnly?: boolean;
  public readonly cooldown?: number;
  public abstract execute: BaseCommandRunner;

  protected readonly description: string;
  protected data: Type;
  protected name?: string;

  public constructor({
    description,
    builder,
    devOnly,
    cooldown,
  }: CommandDataOptions<Type>) {
    this.description = description;
    this.data = builder;
    if (devOnly !== undefined) {
      this.devOnly = devOnly;
    }

    if (cooldown !== undefined) {
      this.cooldown = cooldown;
    }

    this.updateData((builder) => builder.setDescription(this.description));
  }

  public setName(nameOrFileName: string): void {
    const newName = nameOrFileName.slice(
      0,
      nameOrFileName.length - extname(nameOrFileName).length,
    );

    if (this.name) {
      CommandData.logger.throw("Command name cannot be changed after setting");
    }

    if (!newName.length) {
      CommandData.logger.throw("Command name cannot be empty");
    }

    this.name = newName;
    this.updateData((builder) => builder.setName(newName));
  }

  public getName(): string {
    if (!this.name) {
      CommandData.logger.throw("Command name is not set");
    }

    return this.name;
  }

  public getData(): Type {
    return this.data;
  }

  protected updateData(action: (builder: Type) => CommandBuilderTypes): Type {
    this.data = action(this.data) as Type;
    return this.data;
  }
}
