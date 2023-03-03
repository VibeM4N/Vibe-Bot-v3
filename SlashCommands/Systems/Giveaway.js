const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "giveaway",
  description: "A complete giveaway system.",
  options: [
    {
      name: "start",
      description: "Start a giveaway.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "duration",
          description: "Provide a duration for the giveaway (1m, 1h, 1d)",
          type: "STRING",
          required: true,
        },
        {
          name: "winners",
          description: "Select the number of winners for the giveaway.",
          type: "INTEGER",
          required: true,
        },
        {
          name: "prize",
          description: "Provide what the prize would be.",
          type: "STRING",
          required: true,
        },
        {
          name: "channel",
          description: "Select a channel to send the giveaway to.",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
        },
      ],
    },
    {
      name: "actions",
      description: "Options for giveaways.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "end",
              value: "end",
            },
            {
              name: "pause",
              value: "pause",
            },
            {
              name: "unpause",
              value: "unpause",
            },
            {
              name: "reroll",
              value: "reroll",
            },
            {
              name: "delete",
              value: "delete",
            },
          ],
        },
        {
          name: "message-id",
          description: "Provide the message id of the giveaway!",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { options } = interaction;

    const Sub = options.getSubcommand();

    const errorEmbed = new MessageEmbed().setColor("RED");

    const successEmbed = new MessageEmbed().setColor("GREEN");

    if (!interaction.memberPermissions.has("MANAGE_MESSAGES")) {
      const errorReplyEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `You do not have the "Manage Messages" permission to start the giveaway!`
        )
        .setFooter({
          text: `${interaction.user.username}`,
          iconURL: `${interaction.user.avatarURL({
            dynamic: true,
            size: 512,
          })}`,
        });

      return interaction.reply({ embeds: [errorReplyEmbed], ephemeral: true });
    }

    switch (Sub) {
      case "start":
        {
          const gchannel = options.getChannel("channel") || interaction.channel;
          const duration = options.getString("duration");
          const winnerCount = options.getInteger("winners");
          const prize = options.getString("prize");

          client.giveawaysManager
            .start(gchannel, {
              duration: ms(duration),
              winnerCount,
              prize,
              messages: {
                giveaway: "🎉 **GIVEAWAY STARTED** 🎉",
                giveawayEnded: "🎊 **GIVEAWAY ENDED** 🎊",
                winMessage: `Congratulations, {winners}!}`,
              },
            })
            .then(async () => {
              successEmbed.setDescription("Giveaway was sucessfully started!");
              return interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            })
            .catch((err) => {
              errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
              return interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true,
              });
            });
        }
        break;
      case "actions":
        {
          const choice = options.getString("options");
          const messageId = options.getString("message-id");

          const giveaway = client.giveawaysManager.giveaways.find(
            (g) =>
              g.guildId === interaction.guildId && g.messageId === messageId
          );

          if (!giveaway) {
            errorEmbed.setDescription(
              `Unable to find the giveaway with the message id: ${messageId} in this server!`
            );
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          }

          switch (choice) {
            case "end":
              {
                const messageId = options.getString("message-id");
                client.giveawaysManager
                  .end(messageId)
                  .then(() => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("GREEN")
                          .setDescription("Success! Giveaway ended!")
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  })
                  .catch((err) => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("RED")
                          .setDescription(
                            `An error has occurred, please check and try again.\n\`${err}\``
                          )
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                        ,
                      ],
                    });
                  });
              }
              break;
            case "pause":
              {
                const messageId = options.getString("message-id");
                client.giveawaysManager
                  .pause(messageId)
                  .then(() => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("GREEN")
                          .setDescription("Success! Giveaway paused!")
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  })
                  .catch((err) => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("RED")
                          .setDescription(
                            `An error has occurred, please check and try again.\n\`${err}\``
                          )
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  });
              }
              break;
            case "unpause":
              {
                const messageId = options.getString("message-id");
                client.giveawaysManager
                  .unpause(messageId)
                  .then(() => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("GREEN")
                          .setDescription("Success! Giveaway unpaused!")
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  })
                  .catch((err) => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("RED")
                          .setDescription(
                            `An error has occurred, please check and try again.\n\`${err}\``
                          )
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  });
              }
              break;
            case "reroll":
              {
                const messageId = options.getString("message-id");
                client.giveawaysManager
                  .reroll(messageId)
                  .then(() => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("GREEN")
                          .setDescription("Success! Giveaway rerolled!")
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  })
                  .catch((err) => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("RED")
                          .setDescription(
                            `An error has occurred, please check and try again.\n\`${err}\``
                          )
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  });
              }
              break;
            case "delete":
              {
                const messageId = options.getString("message-id");
                client.giveawaysManager
                  .delete(messageId)
                  .then(() => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("GREEN")
                          .setDescription("Success! Giveaway deleted!")
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  })
                  .catch((err) => {
                    return interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("RED")
                          .setDescription(
                            `An error has occurred, please check and try again.\n\`${err}\``
                          )
                          .setFooter({
                            text: `${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL({
                              dynamic: true,
                              size: 512,
                            })}`,
                          }),
                      ],
                    });
                  });
              }
              break;
          }
        }
        break;
      default: {
        console.log("Error in the giveaway command.");
      }
    }
  },
};
