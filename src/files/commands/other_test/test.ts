import { Subcommand } from "../../../classes/commands/Subcommand.ts";

export default new Subcommand({
  description: "deneme 2",
  async execute(interaction) {
    interaction.reply("başarılı 2");
  },
});
