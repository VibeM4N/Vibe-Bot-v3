const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description:
    "Deleted a specific number of messages from the channel or user.",
  options: [
    {
      name: "amount",
      description: "Select the amount of messages to delete.",
      type: "INTEGER",
      required: true,
    },
    {
      name: "user",
      description: "Select a user to clear their messages.",
      type: "USER",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, options, member } = interaction;

    const Amount = options.getInteger("amount");
    const User = options.getUser("user");

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

    if (Amount > 100) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("I Can Only Clear/Purge 100 Messages At A Time!"),
        ],
        ephemeral: true,
      });
    }

    if (Amount < 1) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `The amount of messages to clear must be greater or equal to 1`
            ),
        ],
        ephemeral: true,
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
          interaction.reply({ embeds: [Response] });
        });
      } else {
        await channel.bulkDelete(Amount, true).then((messages) => {
          Response.setDescription(
            `🧹 | Cleared ${messages.size} from this channel!`
          );
          interaction.reply({ embeds: [Response] });
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `❌ | There was an error while runnning this command.`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
