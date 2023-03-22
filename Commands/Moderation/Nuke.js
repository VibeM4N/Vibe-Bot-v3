const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "nuke",
  category: "Moderation",
  aliases: ["bombchannel"],
  /**
   * @param { Message } message
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `You do not have the permisson \`MANAGE_CHANNELS\` to use this command!`
            ),
        ],
      });
    }

    const Embed = new MessageEmbed()
      .setColor("YELLOW")
      .setTitle(`Channel Nuked by ${message.member.user.tag}`)
      .setImage(`https://i.imgur.com/Da7ScU4.gif`);

    try {
      message.channel.clone().then((channel) => {
        channel
          .setPosition(message.channel.position)
          .then(message.channel.delete());

        return channel.send({embeds: [Embed]});
      });
    } catch (err) {
      return message.reply({
        content: `There was an error while nuking the channel!`,
      });
    }
  },
};
