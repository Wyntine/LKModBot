import {
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../../classes/commands/Command.ts";
import { Options } from "../../classes/commands/Options.ts";
import {
  mediaGalleryItem,
  separator,
  textDisplay,
} from "../../utils/components.ts";
import { capitalize } from "../../utils/stringUtils.ts";

async function refreshProfiles(
  interaction: ChatInputCommandInteraction,
  type: "user" | "server",
  disabled = false,
) {
  const user = interaction.user;
  const selectedUser = interaction.options.getUser("kisi") ?? user;
  const isSelf = selectedUser.id === user.id;

  const member = await interaction.guild?.members
    .fetch(selectedUser)
    .catch(() => {});

  const userProfile = user.displayAvatarURL({ size: 2048 });
  const serverProfile = member?.displayAvatarURL({ size: 2048 });

  const selectedProfile =
    type === "user" ? userProfile : (serverProfile as string);

  if (!serverProfile || serverProfile === userProfile) {
    type = "user";
  }

  const profileTypeText = type === "user" ? "profil" : "sunucu profil";

  const titleText = isSelf
    ? `${capitalize(profileTypeText)} fotoğrafınız`
    : `${member?.toString() ?? user.toString()} adlı kullanıcının ${profileTypeText} fotoğrafı`;

  const container = new ContainerBuilder();

  if (member && userProfile !== serverProfile) {
    container.addSectionComponents((section) =>
      section
        .addTextDisplayComponents(textDisplay(titleText))
        .setButtonAccessory((button) =>
          button
            .setCustomId("profile-change")
            .setStyle(disabled ? ButtonStyle.Secondary : ButtonStyle.Primary)
            .setEmoji({ name: "🔃" })
            .setDisabled(disabled),
        ),
    );
  } else {
    container.addTextDisplayComponents((text) => text.setContent(titleText));
  }

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [
      container
        .addSeparatorComponents(separator())
        .addMediaGalleryComponents((component) =>
          component.addItems(mediaGalleryItem(selectedProfile)),
        )
        .addSeparatorComponents(separator())
        .addTextDisplayComponents(
          textDisplay(`-# __İsteyen__: ${user.toString()} (${user.id})`),
        ),
    ],
  } as const;
}

export default new Command({
  options: Options.create(
    "Kendinizin veya seçilen kişinin profil fotoğrafını gösterir.",
  ),
  builder: new SlashCommandBuilder().addUserOption((user) =>
    user
      .setRequired(false)
      .setName("kisi")
      .setDescription("Profili görüntülenecek kişi"),
  ),
  async execute(interaction) {
    let type: "user" | "server" = "user";

    const message = await interaction.reply(
      await refreshProfiles(interaction, type),
    );

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (int) => int.user.id === interaction.user.id,
      time: 60 * 1000,
    });

    collector
      .on("collect", async () => {
        type = type === "server" ? "user" : "server";
        await interaction
          .editReply(await refreshProfiles(interaction, type))
          .catch(() => {});
      })
      .on("end", async () => {
        await interaction
          .editReply(await refreshProfiles(interaction, type, true))
          .catch(() => {});
      });
  },
});
