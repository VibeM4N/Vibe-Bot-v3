const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "slowmode",
  description: "Adds slowmode.",
  options: [
    {
      name: "add",
      description: "Adds slowmode to the channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "time",
          description:
            "Time is seconds for the slowmode (Make sure to enter in seconds!)",
          type: "STRING",
          required: true,
          choices: [
            { name: "5s", value: "5s" },
            { name: "10s", value: "10s" },
            { name: "15s", value: "15s" },
            { name: "30s", value: "30s" },
            { name: "1m", value: "60s" },
            { name: "2m", value: "120s" },
            { name: "5m", value: "300s" },
            { name: "10m", value: "600s" },
            { name: "15m", value: "900s" },
            { name: "30m", value: "1800s" },
            { name: "1h", value: "3600s" },
            { name: "2h", value: "7200s" },
            { name: "6h", value: "21600s" },
          ],
        },
        {
          name: "channel",
          description: "Adds slowmode for the channel.",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: false,
        },
      ],
    },
    {
      name: "remove",
      description: "There will be no slowmode",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description:
            "The channel to remove the slowmode (By default removes the slowmode in the channel you are using).",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: false,
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guild, member } = interaction;

    const subcommand = options.getSubcommand();

    const Channel = options.getChannel("channel") || interaction.channel;

    const errEmbed = new MessageEmbed().setColor("RED");

    if (!member.permissions.has("MANAGE_CHANNELS")) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `You do not have the permission \`MANAGE_CHANNELS\` to use this command!`
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      switch (subcommand) {
        case "add":
          try {
            const Channel =
              options.getChannel("channel") || interaction.channel;
            const Time = options.getString("time");

            if (Channel.rateLimitPerUser > 0) {
              return interaction.reply({
                embeds: [
                  errEmbed.setDescription(
                    `There is already slowmode enabled in the channel`
                  ),
                ],
                ephemeral: true,
              });
            }

            switch (Time) {
              case "5s":
                Channel.setRateLimitPerUser(5);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "10s":
                Channel.setRateLimitPerUser(10);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "15s":
                Channel.setRateLimitPerUser(15);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "30s":
                Channel.setRateLimitPerUser(30);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "60s":
                Channel.setRateLimitPerUser(60);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "120s":
                Channel.setRateLimitPerUser(120);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "300s":
                Channel.setRateLimitPerUser(300);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "600s":
                Channel.setRateLimitPerUser(600);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "900s":
                Channel.setRateLimitPerUser(900);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "1800s":
                Channel.setRateLimitPerUser(1800);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "3600s":
                Channel.setRateLimitPerUser(3600);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "7200s":
                Channel.setRateLimitPerUser(7200);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
              case "21600s":
                Channel.setRateLimitPerUser(21600);
                interaction.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor("GREEN")
                      .setDescription(
                        `Slowmode has been set to **${Time}** in ${Channel}`
                      ),
                  ],
                });
                break;
            }
          } catch (err) {
            throw err;
          }

          break;
        case "remove":
          try {
            const Channel =
              options.getChannel("channel") || interaction.channel;

            if (Channel.rateLimitPerUser === 0) {
              return interaction.reply({
                embeds: [
                  errEmbed.setDescription(
                    `There is no slowmode set in ${Channel}`
                  ),
                ],
                ephemeral: true,
              });
            }

            Channel.setRateLimitPerUser(0);
            interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("GREEN")
                  .setDescription(`The slowmode in ${Channel} was removed!`),
              ],
            });
          } catch (err) {
            throw err;
          }
          break;
      }
    } catch (err) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `There was error while running this command!`
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
