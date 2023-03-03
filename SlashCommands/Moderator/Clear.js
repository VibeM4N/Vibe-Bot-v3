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
    const { channel, options } = interaction;

    const Amount = options.getInteger("amount");
    const User = options.getUser("user");

    const Messages = await channel.messages.fetch();

    const Response = new MessageEmbed().setColor("BLURPLE");

    if (Amount > 100) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("I Can Only Clear/Purge 100 Messages At A Time!"),
        ],
        ephemeral: true,
      });
    } else if (Amount <= 100) {
      if (User) {
        let i = 0;
        const filtered = [];
        (await Messages).filter((m) => {
          if (m.author.id === User.id && Amount > 1) {
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
      };
    };
  },
};
