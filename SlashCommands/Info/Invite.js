const {
  CommandInteraction,
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");

module.exports = {
  name: "invite",
  description: "Get an invite to the bot!",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Invite")
        .setURL(client.config.BotInvite)
        .setStyle("LINK"),

      new MessageButton()
        .setLabel("Support server")
        .setURL(client.config.SupportServerInvite)
        .setStyle("LINK")
    );

    const Embed = new MessageEmbed()
      .setTitle(`📨・Invite Me!`)
      .setDescription(`Make your server even better with Vibe Bot!`)
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      })
      .setURL(client.config.BotInvite);

    await interaction.reply({ embeds: [Embed], components: [row] });
  },
};
