async function loadEvents(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const Table = new ascii().setHeading("Events", "Status");

//   await client.events.clear();

  const Files = await loadFiles("Events");

  Files.forEach((file) => {
    const event = require(file);

    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);

    if (event.once) {
      client.once(event.name, execute);
    } else {
      client.on(event.name, execute);
    }

    Table.addRow(event.name, "✔")
  });

  return console.log(Table.toString())
}

module.exports = { loadEvents };
