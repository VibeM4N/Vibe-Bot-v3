const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const command = client.slashcommands.get(interaction.commandName);
      if (!command) {
        return (
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔ | This command is outdated!"),
            ],
          }) && client.slashcommands.delete(interaction.commandName)
        );
      }

      if (command.developer && interaction.user.id !== "457796506481721353") {
        return interaction.reply({
          content: "This Command Only Available To The Developers.",
          ephemeral: true,
        });
      }

      command.execute(interaction, client);
    }
  },
};
