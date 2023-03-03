async function loadCommands(client) {
  const ascii = require("ascii-table");
  const Table = new ascii().setHeading("Commands", "Status");

  const { loadFiles } = require("../Functions/fileLoader");

  // await client.commands.clear();

  let commandsArray = [];

  const Files = await loadFiles("SlashCommands");

  Files.forEach((file) => {
    const command = require(file);

    if(!command.name) {
      return Table.addRow(`${file.split("/")[7]}`, " Failed | Missing a name.");
    ;}

    if(!command.context && !command.description) {
      return Table.addRow(command.name, "Failed | missing a description.")
    }

    client.slashcommands.set(command.name, command);

    commandsArray.push(command)

    Table.addRow(command.name, "✔");
  });

  client.application.commands.set(commandsArray);

  return console.log(Table.toString());
}

module.exports = { loadCommands };
