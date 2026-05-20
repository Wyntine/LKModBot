import { Subcommand } from "../../../../classes/commands/Subcommand.ts";

export default new Subcommand({
  description: "deneme 3",
  async execute(interaction) {
    interaction.reply("başarılı 3");
  },
});
