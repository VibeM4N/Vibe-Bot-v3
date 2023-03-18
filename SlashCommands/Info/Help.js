const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  CommandInteraction,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Displays a list of available commands or detailed information for a specific command.",
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { client } = interaction;

    const categories = [
      ...new Set(client.commands.map((command) => command.category)),
    ];
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Help")
      .setDescription(
        "Please select a category to see the available commands."
      )
      .setTimestamp()
      .setFooter({ text: interaction.user.username, avatarURL: interaction.user.avatarURL({ dynamic: true }) });

    const options = categories.map((category) => ({
      label: category,
      value: category,
    }));

    const selectMenu = new MessageSelectMenu()
      .setCustomId("help-select")
      .setPlaceholder("Select a category")
      .setOptions(options);

    const row = new MessageActionRow().addComponents(selectMenu);

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const filter = (i) =>
      i.customId === "help-select" && i.user.id === interaction.user.id;

    const collector = reply.createMessageComponentCollector({
      filter,
      time: 30000,
    });

    try {
      collector.on("collect", async (i) => {
        const category = i.values[0];
        const commands = client.commands.filter(
          (command) => command.category === category
        );

        const categoryEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(`Commands in the ${category} category`)
          .setTimestamp()
          .setFooter({ text: interaction.user.username, avatarURL: interaction.user.avatarURL({ dynamic: true }) });

        const commandFields = commands.map((command) => ({
          name: `${command.name}`,
          value: command.description || "No Description",
        }));

        categoryEmbed.addFields(commandFields);

        await i.update({ embeds: [categoryEmbed], components: [row] });
      });
    } catch (err) {
      throw err;
    }
    try {
      collector.on("end", async () => {
        const disabledSelectMenu = new MessageSelectMenu()
          .setCustomId("help-select")
          .setPlaceholder("Select a category")
          .setOptions(options)
          .setDisabled(true);

        const disabledRow = new MessageActionRow().addComponents(disabledSelectMenu);

        await reply.edit({ components: [disabledRow] })
      });
    } catch (err) {
      throw err;
    }
  },
};