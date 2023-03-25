const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  category: "Moderation",
  aliases: ["purge"],
  /**
   * @param { Message } message
   */
  run: async (client, message, args) => {
    const { channel, member } = message;

    const Amount = args[0];
    const User = message.mentions.users.first() || args[1];

    const Response = new MessageEmbed().setColor("BLURPLE");

    if (!member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `You do not have the permission \`MANAGE_MESSAGES\` to use this command!`
            ),
        ],
        ephemeral: true,
      });
    }

    if (!Amount) {
      return channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "You must enter the amount of messages you want to clear."
            )
            .setFooter({
              text: `Usage: ${client.config.Prefix}clear (Amount) (User)`,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (isNaN(Amount) === true) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("You must enter the amount of messages to clear!")
            .setFooter({
              text: `Usage: ${client.config.Prefix}clear (Amount) (User)`,
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
            .setDescription("I can only clear 100 messages per at a time!")
            .setFooter({
              text: `Usage: ${client.config.Prefix}clear (Amount) (User)`,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (Amount < 1) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `The amount of messsages to clear must be greater or equal to 1`
            )
            .setFooter({
              text: `Usage: ${client.config.Prefix}clear (Amount) (User)`,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    try {
      const Messages = await channel.messages.fetch({ limit: Amount });

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
          channel.send({ embeds: [Response] });
        });
      }
    } catch (err) {
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `❌ | There was an error while runnning this command.`
            ),
        ],
      });
      throw err;
    }
  },
};
