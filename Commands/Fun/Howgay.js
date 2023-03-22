const { MessageEmbed, Client, Message } = require("discord.js");

module.exports = {
  name: "howgay",
  category: "Fun",
  description: "Guess's how gay you are 🏳‍🌈!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {*} args
   */
  run: async (client, message, args) => {
    var result = Math.ceil(Math.random() * 100);

    const Embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`🏳‍🌈・Gay rate`)
      .setDescription(`You are ${result}% gay!`)
      .setFooter({ text: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true}) });

    message.reply({ embeds: [Embed] });
  },
};
