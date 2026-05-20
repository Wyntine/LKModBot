import type { OptionsData } from "../../types/commands.js";
import { Logger } from "../Logger.ts";

export class Options {
  public static readonly logger: Logger = new Logger("CommandOptions");

  private readonly description: string;
  private devOnly?: boolean;
  private cooldown?: number;

  public constructor({ description, devOnly, cooldown }: OptionsData) {
    this.description = description;

    if (devOnly != undefined) {
      this.devOnly = devOnly;
    }

    if (cooldown != undefined) {
      this.cooldown = cooldown;
    }
  }

  public static create(description: string): Options {
    return new Options({ description });
  }

  public static from(options: Options | OptionsData): Options {
    return options instanceof Options ? options : new Options(options);
  }

  public fillInto(otherOption: Options): void {
    if (this.isDevOnlySet() && !otherOption.isDevOnlySet()) {
      otherOption.setDevOnly(this.getDevOnly());
    }

    if (this.isCooldownSet() && !otherOption.isCooldownSet()) {
      otherOption.setCooldown(this.getCooldown());
    }
  }

  public getDescription(): string {
    return this.description;
  }

  public getDevOnly(): boolean {
    return this.devOnly ?? false;
  }

  public getCooldown(): number {
    return this.cooldown ?? 0;
  }

  public setDevOnly(devOnly: boolean): this {
    if (this.isDevOnlySet()) {
      Options.logger.throw("'devOnly' is already set.");
    }

    this.devOnly = devOnly;
    return this;
  }

  public setCooldown(cooldown: number): this {
    if (this.isCooldownSet()) {
      Options.logger.throw("'cooldown' is already set.");
    }

    this.cooldown = cooldown;
    return this;
  }

  public isDevOnlySet(): boolean {
    return this.devOnly != undefined;
  }

  public isCooldownSet(): boolean {
    return this.cooldown != undefined;
  }
}
