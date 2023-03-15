const {} = require("discord.js");

module.exports = {
  name: "ping",
  category: "Info",
  run: async (client, message, args) => {
    message.reply("Pong");
  },
};
