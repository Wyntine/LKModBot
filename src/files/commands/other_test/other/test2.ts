import { Subcommand } from "../../../../classes/commands/Subcommand.ts";

export default new Subcommand({
  options: { description: "deneme 3" },
  async execute(interaction) {
    interaction.reply("başarılı 3");
  },
});
