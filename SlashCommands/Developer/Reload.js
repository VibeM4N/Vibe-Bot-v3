const { CommandInteraction, Client, Interaction } = require("discord.js");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "reload",
  description: "Reloads the command",
  options: [
    {
      name: "command",
      description: "The command to reload",
      type: "STRING",
      required: true,
    },
    {
      name: "all",
      description: "Whether to reload all the commands",
      type: "BOOLEAN",
      required: false,
    },
  ],
  developer: true,
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const commandName = interaction.options.getString("command");
    const allCommands = interaction.options.getBoolean("all");

    const command = interaction.client.commands.get(commandName);

    let fileName = `../../Commands/${command.category}/${command.name}.js`;
    let capitalizedSeventhChar = fileName.charAt(35).toUpperCase();
    let acutalFileName =
      fileName.slice(0, 35) + capitalizedSeventhChar + fileName.slice(36);

    if (allCommands) {
      interaction.client.commands.forEach((command) => {
        delete require.cache[require.resolve(acutalFileName)];
      });

      return interaction.reply("All commands have been reloaded!");
    }

    if (!command)
      return interaction.reply(
        `There is no command with name "${commandName}".`
      );

    delete require.cache[require.resolve(acutalFileName)];

    try {
      const newCommand = require(acutalFileName);
      interaction.client.commands.set(newCommand.name, newCommand);
      interaction.reply(`Command "${commandName}" was reloaded!`);
    } catch (error) {
      console.error(error);
      interaction.reply(
        `There was an error while reloading command "${commandName}": \`${error.message}\``
      );
    }
  },
  guildIds: ["1004034623061381261"],
};
