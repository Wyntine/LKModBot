import { Command } from "../../classes/commands/Command.ts";
import { Options } from "../../classes/commands/Options.ts";

export default new Command({
  options: Options.create("deneme 1").setCooldown(10),
  async execute(interaction) {
    interaction.reply("başarılı 1");
  },
});
