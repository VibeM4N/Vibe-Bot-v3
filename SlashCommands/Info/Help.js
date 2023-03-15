const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "help",
  description:
    "Displays a list of available commands or detailed information for a specific command.",
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
      );

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
      time: 5000,
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
          .setTimestamp();

        const commandFields = commands.map((command) => ({
          name: `${command.name}`,
          value: command.description || "No Description",
        }));

        categoryEmbed.addFields(commandFields);

        await i.update({ embeds: [categoryEmbed], components: [row] });
      });
    } catch (err) {
      console.log(err);
    }
    try {
      collector.on("end", async () => {
        const disabledSelectMenu = new MessageSelectMenu()
          .setCustomId("help-select")
          .setPlaceholder("Select a category")
          .setOptions(options)

          await reply.edit({components: [disabledSelectMenu]})
      });
    } catch (err) {
      console.log(err);
    }
  },
};
