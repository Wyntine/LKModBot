import { Event } from "../../classes/Event.ts";
import { getCommand } from "../../handlers/command.ts";

export default new Event({
  name: "commands",
  category: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inGuild()) {
      return;
    }

    const command = getCommand(interaction.commandName);

    if (!command) {
      return;
    }

    command.execute(interaction);
  },
});
