const client = require("../../Structures/index");
const { MessageEmbed } = require("discord.js");

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    "Off" || queue.filters.names.join(", ")
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `🎶 | Now Playing \`${song.name}\` - \`${
              song.formattedDuration
            }\`\nRequested by: ${song.user}\n${status(queue)}`
          )
          .setFooter({
            text: `${song.user.username}`,
            iconURL: `${song.user.avatarURL({ dynamic: true })}`,
          }),
      ],
    })
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `🎶 | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
          )
          .setFooter({
            text: `${song.user.username}`,
            iconURL: `${song.user.avatarURL({ dynamic: true })}`,
          }),
      ],
    })
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `🎶 | Added \`${playlist.name}\` playlist (${
              playlist.songs.length
            } songs) to queue\n${status(queue)}`
          )
          .setFooter({
            text: `${song.user.username}`,
            iconURL: `${song.user.avatarURL({ dynamic: true })}`,
          }),
      ],
    })
  )
  .on("error", (channel, e) => {
    if (channel)
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `❌ | An error encountered: ${e.toString().slice(0, 1974)}`
            ),
        ],
      });
    else console.error(e);
  })
  .on("empty", queue =>
  queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription("Voice channel is empty! Leaving the channel..."),
      ],
    })
  )
  .on("searchNoResult", (queue, query) =>
    queue.textChannel.send({
      emebds: [
        new MessageEmbed()
          .setColor("RED")
          .setDescription(`❌ | No result found for \`${query}\`!`)
          .setFooter({
            text: `${song.user.username}`,
            iconURL: `${song.user.avatarURL({ dynamic: true })}`,
          }),
      ],
    })
  );

// // DisTubeOptions.searchSongs = true
// .on("searchResult", (message, result) => {
//     let i = 0
//     message.channel.send(
//         `**Choose an option from below**\n${result
//             .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
//             .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
//     )
// })
// .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
// .on("searchInvalidAnswer", message =>
//     message.channel.send(
//         `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
//     )
// )
// .on("searchDone", () => {})
