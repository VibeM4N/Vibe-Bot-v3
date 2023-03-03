const { Client, Collection } = require("discord.js");
const client = new Client({
  intents: 65519,
  partials: ["GUILD_MEMBER", "MESSAGE", "REACTION", "USER", "CHANNEL"],
});

const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnStop: false,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new YtDlpPlugin()
  ],
  youtubeDL: false,
  updateYouTubeDL: false,
});
module.exports = client;

const { loadEvents } = require("./Handlers/EventHandler");
require("../Systems/GiveawaySys")(client);
client.config = require("./config.json");

client.events = new Collection();
client.slashcommands = new Collection();
client.commands = new Collection();

loadEvents(client);
client.loadCommands = (client, reload) =>
  require("./Handlers/CommandHandler")(client, reload);
client.loadCommands(client, false);

client.login(client.config.Token);