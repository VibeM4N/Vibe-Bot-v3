const { getFiles } = require("../Functions/fileLoader");
const fs = require("fs");
const { } = require("../../")

module.exports = (client) => {
  fs.readdirSync("./Commands/").forEach((category) => {
    let commands = getFiles(`./Commands/${category}`, ".js");

    commands.forEach((f) => {
      const command = require(`../../Commands/${category}/${f}`);
      client.commands.set(command.name, command);
    });
  });
};
