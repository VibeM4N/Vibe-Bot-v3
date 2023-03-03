const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "member-info",
  type: "USER",
  context: true,
  /**
   *
   * @param {ContextMenuInteraction} interaction
   */
  async execute(interaction) {
    const User = await interaction.guild.members.fetch(interaction.targetId);

    const Response = new MessageEmbed()
      .setColor("AQUA")
      .setAuthor({
        name: User.user.tag,
        iconURL: User.user.avatarURL({ dynamic: true, size: 512 }),
      })
      .setThumbnail(User.user.avatarURL({ dynamic: true, size: 512 }))
      .addFields(
        {
          name: "ID",
          value: `${User.user.id}`,
        },
        {
          name: "Roles",
          value: `${
            User.roles.cache
              .map((r) => r)
              .join(" ")
              .replace("@everyone", " ") || "None"
          }`,
        },
        {
            name: "Memeber Since",
            value: `<t:${parseInt(User.joinedTimestamp / 1000)}:R>`,
            inline: true
        },
        {
            name: "Discord User Since",
            value: `<t:${parseInt(User.user.createdTimestamp / 1000)}:R>`,
            inline: true
        },
      );

    interaction.reply({ embeds: [Response], ephemeral: true });
  },
};
