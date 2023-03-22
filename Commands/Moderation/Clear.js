const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  category: "Moderation",
  aliases: ["purge"],
  /**
   * @param { Message } message
   */
  run: async (client, message, args) => {
    const { channel } = message;

    const Amount = args[0];
    const User = message.mentions.users.first() || args[1];

    
    const Messages = await channel.messages.fetch({limit: Amount})

    const Response = new MessageEmbed().setColor("BLURPLE");

    if (!Amount) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "You must enter the amount of messages you want to clear."
            )
            .setFooter({
              text: message.member.user.tag,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (isNaN(Amount) == true) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("You must enter the amount of messages to clear!")
            .setFooter({
              text: message.member.user.tag,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (Amount > 100) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("I Can Only Clear/Purge 100 Messages At A Time!"),
        ],
      });
    }

    if (Amount < 1) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`The amount of messsages to clear must be greater or equal to 1`)
            .setFooter({
              text: message.member.user.tag,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (User) {
      let i = 0;
      const filtered = [];
      (await Messages).filter((m) => {
        if (m.author.id === User.id) {
          filtered.push(m);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        Response.setDescription(
          `🧹 | Cleared ${messages.size} messages from ${User}!`
        );
        message.channel.send({ embeds: [Response] });
      });
    } else {
      await channel.bulkDelete(Amount, true).then((messages) => {
        Response.setDescription(
          `🧹 | Cleared ${messages.size} from this channel!`
        );
        message.channel.send({ embeds: [Response] });
      });
    }
  },
};
