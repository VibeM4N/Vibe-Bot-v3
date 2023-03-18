const { Client, Message } = require("discord.js");
const { Prefix, Developers } = require("../../Structures/config.json");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  async execute(message, client) {
    if (!message.content.startsWith(Prefix) || message.author.bot) return;

    const args = message.content.slice(Prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (command) => command.aliases && command.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.devOnly && !Developers.includes(message.member.id)) {
      return message.reply(
        "This command is only available to the bot developers!"
      );
    }

    if (
      command.permissions &&
      message.member.permissions.missing(command.permissions).length !== 0
    ) {
      return message.reply("You do not have permission to use this command");
    }

    try {
      await command.run(client, message, args);
    } catch (err) {
      console.log(err);
      let errMsg = err.toString();

      if (errMsg.startsWith("?")) {
        errMsg = errMsg.slice(1);
        await message.reply(errMsg);
      } else console.error(err);
    }
  },
};
