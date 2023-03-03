const { Client } = require("discord.js");
const { loadCommands } = require("../../Structures/Handlers/SlashCommandHandler");
const mongoose = require("mongoose");
const { Database } = require("../../Structures/config.json");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    await loadCommands(client);

    if (!Database) return;
    mongoose.set("strictQuery", true);
    mongoose
      .connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("The client is now connected to the database!");
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(`Client is now logged in as ${client.user.username}`);
    console.log(`Loaded ${client.commands.size} commands`);
  },
};
