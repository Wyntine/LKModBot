import { Command } from "../../classes/commands/Command.ts";

export default new Command({
  description: "deneme",
  async execute(interaction) {
    interaction.reply("başarılı");
  },
});
