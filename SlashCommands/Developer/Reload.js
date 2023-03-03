const { CommandInteraction, Client, Interaction } = require("discord.js");

// ON HOLD

module.exports = {
  name: "reload",
  description: "Reloads the commands",
  execute(interaction) {
    interaction.reply("Hey");
  },
};