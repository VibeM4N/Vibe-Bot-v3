const { MessageEmbed, Client, Message } = require("discord.js");

module.exports = {
  name: "8ball",
  category: "Fun",
  aliases: ["eight-ball", "eightball"],
  description: "Reply to your question!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {*} args
   */
  run: async (client, message, args) => {
    const Question = args.join(" ");

    if (!Question) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`You must ask me a question first!`)
            .setFooter({
              text: message.member.user.tag,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    var Answers = [
      "Yes!",
      "Unfortunately not",
      "You are absolutely right!",
      "No, sorry.",
      "I agree",
      "No idea!",
      "I am not that smart ..",
      "My sources say no!",
      "It is certain",
      "You can rely on it",
      "Probably not",
      "Everything points to a no",
      "No doubt",
      "Absolutely",
      "I do not know",
    ];

    var Result = Math.floor(Math.random() * Answers.length);

    const Embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle(`🎱・8ball`)
      .setDescription(`See the answer for your question!`)
      .setFields([
        {
          name: `💬 | Your Question`,
          value: `\`\`\`${Question}\`\`\``,
          inline: false,
        },
        {
          name: `🤖 | My Answer`,
          value: `\`\`\`${Answers[Result]}\`\`\``,
          inline: false,
        },
      ]);

    message.reply({ embeds: [Embed] });
  },
};
