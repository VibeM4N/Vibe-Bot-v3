const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Info about the server!",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  execute(interaction) {
    const { guild } = interaction;

    const { createdTimestamp, ownerId } = guild;

    const Embed = new MessageEmbed()
      .setColor("PURPLE")
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "GENERAL",
          value: [
            `Name: ${guild.name}`,
            `Created: <t:${parseInt(createdTimestamp / 1000)}:R>`,
            `Owner: <@${ownerId}>`,
            `Roles: ${guild.roles.cache.size}`,
            `Description: ${
              guild.description || "**There is no Server Description!**"
            }`,
          ].join("\n"),
        },
        {
          name: "💡 | USERS",
          value: [
            `Members: ${guild.members.cache.filter((m) => !m.user.bot).size}`,
            `Bots: ${guild.members.cache.filter((m) => m.user.bot).size}`,
            `Total: **${guild.memberCount}**`,
          ].join("\n"),
        },
        {
          name: "📚 | CHANNELS",
          value: [
            `- Text: ${
              guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size
            }`,
            `- Voice: ${
              guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size
            }`,
            `- Threads: ${
              guild.channels.cache.filter(
                (c) =>
                  c.type === "GUILD_PRIVATE_THREAD" &&
                  "GUILD_NEWS_THREAD" &&
                  "GUILD_PUBLIC_THREAD"
              ).size
            }`,
            `- Category: ${
              guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY")
                .size
            }`,
            `- Stages: ${
              guild.channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE")
                .size
            }`,
            `- News: ${
              guild.channels.cache.filter((c) => c.type === "GUILD_NEWS").size
            }`,
            `Total: **${guild.channels.cache.size}**`,
          ].join("\n"),
        },
        {
          name: "EMOJIS AND STICKERS",
          value: [
            `-Normal: ${guild.emojis.cache.filter((e) => e.animated).size}`,
            `-Ainimated: ${guild.emojis.cache.filter((e) => !e.animated).size}`,
            `-Stickers: ${guild.stickers.cache.size}`,
            `Total: **${guild.stickers.cache.size + guild.emojis.cache.size}**`,
          ].join("\n")
        }
      );

    interaction.reply({ embeds: [Embed] });
  },
};
