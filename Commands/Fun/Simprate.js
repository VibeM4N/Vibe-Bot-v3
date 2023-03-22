const { MessageEmbed, Client, Message } = require("discord.js");

module.exports = {
  name: "simprate",
  aliases: ["simp"],
  category: "Fun",
  description: "Guess's how much of a simp you are!",
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
      .setTitle(`👀・Simp rate`)
      .setDescription(`You are ${result}% simp!`)
      .setFooter({ text: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true}) });

    message.reply({ embeds: [Embed] });
  },
};
