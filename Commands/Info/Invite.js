const {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Message,
} = require("discord.js");

module.exports = {
  name: "invite",
  description: "Get an invite to the bot!",
  category: "Info",
  aliases: ["inv", "botinv"],
  /**
   * @param {Message} message
   * @param {Client} client
   */
  run: async (client, message, args) => {
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
        text: message.member.user.username,
        iconURL: message.member.user.avatarURL({dynamic: true})
      })
      .setURL(client.config.BotInvite);

    await message.channel.send({ embeds: [Embed], components: [row] });
  },
};
