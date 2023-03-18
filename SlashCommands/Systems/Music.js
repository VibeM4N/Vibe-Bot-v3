const { CommandInteraction, MessageEmbed, Client } = require("discord.js");

module.exports = {
  name: "music",
  description: "Music system",
  options: [
    {
      name: "play",
      description: "Play a song.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "query",
          description: "Provide a name or an url for the song",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "leave",
      description: "Leaves the Voice Channel",
      type: "SUB_COMMAND",
    },
    {
      name: "join",
      description: "Joins the Voice Channel",
      type: "SUB_COMMAND",
    },
    {
      name: "volume",
      description: "Change the volume.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "percent",
          description: "10 = 10%",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "settings",
      description: "Select a setting.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "🔢 View queue",
              value: "queue",
            },
            {
              name: "⏭ Skip Song",
              value: "skip",
            },
            {
              name: "⏸ Pasue Song",
              value: "pause",
            },
            {
              name: "⏯ Resume Song",
              value: "resume",
            },
            {
              name: "⏹ Stop Music",
              value: "stop",
            },
            {
              name: "🔀 Shuffle Queue",
              value: "shuffle",
            },
            {
              name: "🔃 Toggle Autoplay Modes",
              value: "AutoPlay",
            },
            {
              name: "🔁 Toggle Repeat Mode",
              value: "RepeatMode",
            },
          ],
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild, channel } = interaction;
    const VoiceChannel = member.voice.channel;

    if (!VoiceChannel)
      return interaction.reply({
        content: "You must be in a VC to use the music commands",
        ephemeral: true,
      });

    if (
      guild.me.voice.channelId &&
      VoiceChannel.id !== guild.me.voice.channelId
    )
      return interaction.reply({
        content: `I am playing music in <#${guild.me.voice.channelId}>`,
        ephemeral: true,
      });

    try {
      switch (options.getSubcommand()) {
        case "play": {
          const queue = await client.distube.getQueue(VoiceChannel);

          if (!queue) {
            client.distube.play(VoiceChannel, options.getString("query"), {
              textChannel: channel,
              member,
            });
            return interaction.reply({
              content: "🎶 | Ready To Play Some Music.",
              ephemeral: true,
            });
          } else {
            client.distube.play(VoiceChannel, options.getString("query"), {
              textChannel: channel,
              member,
            });
            return interaction.reply({
              content: "🎶 | Added the requested song to the queue!",
              ephemeral: true,
            });
          }
        }

        case "join": {
          client.distube.voices.join(VoiceChannel);
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("GREEN")
                .setDescription("Ready To Play Some Music!")
                .setFooter({
                  text: `${member.user.username}`,
                  iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
                }),
            ],
          });
        }

        case "leave": {
          client.distube.voices.leave(VoiceChannel);
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("GREEN")
                .setDescription("Bye! Leaving the Voice Channel")
                .setFooter({
                  text: `${member.user.username}`,
                  iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
                }),
            ],
          });
        }

        case "volume": {
          const Volume = options.getNumber("percent");
          if (Volume > 100 || Volume < 1)
            return interaction.reply({
              content: "You have to specify a number between 1 and 100.",
            });

          client.distube.setVolume(VoiceChannel, Volume);
          return interaction.reply({
            content: `📶 Voume has been set to \`${Volume}%\``,
          });
        }

        case "settings": {
          const queue = await client.distube.getQueue(VoiceChannel);

          if (!queue)
            return interaction.reply({
              content: "⛔ There is no music playing!",
            });

          switch (options.getString("options")) {
            case "skip":
              if (!queue) {
                return interaction.reply({
                  content: `❌ | There is nothing in the queue right now!`,
                });
              }
              try {
                const song = await queue.skip();
                return interaction.reply({
                  content: `👌 | Skipped! Now playing:\n${song.name}`,
                });
              } catch (e) {
                return interaction.reply({
                  content: `There is no song up ahead in the queue!`,
                });
              }

            case "stop":
              await queue.stop(VoiceChannel);
              return interaction.reply({
                content: "⏹ Music has been stopped!",
              });

            case "pause":
              await queue.pause(VoiceChannel);
              return interaction.reply({ content: "⏸ Music has been paused!" });

            case "resume":
              await queue.resume(VoiceChannel);
              return interaction.reply({
                content: "⏯ Music has been resumed!",
              });

            case "shuffle":
              await queue.shuffle(VoiceChannel);
              return interaction.reply({
                content: "⏯ Music has been shuffled!",
              });

            case "AutoPlay":
              let Mode = await queue.toggleAutoplay(VoiceChannel);
              return interaction.reply({
                content: `🔃 Autoplay mode is set to: ${Mode ? "On" : "Off"}`,
              });

            case "RepeatMode":
              let RepeatMode = await client.distube.setRepeatMode(queue);
              return interaction.reply({
                content: `🔃 Repeat mode is set to: ${(RepeatMode = RepeatMode
                  ? RepeatMode == 2
                    ? "Queue"
                    : "Song"
                  : "Off")}`,
              });

            case "queue":
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription(
                      `${queue.songs.map(
                        (song, id) =>
                          `\n**${id + 1}**. ${song.name} - \`${
                            song.formattedDuration
                          }\``
                      )}`
                    ),
                ],
              });
          }
          return;
        }
      }
    } catch (err) {
      console.log(err);
      const errEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`⛔ | An error occurred!`);
      return interaction.reply({ embeds: [errEmbed] });
    }
  },
};
