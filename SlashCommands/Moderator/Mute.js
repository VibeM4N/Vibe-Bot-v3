const { Message, CommandInteraction, MessageEmbed } = require("discord.js");
const MuteModel = require("../../Structures/Schemas/MuteDB");

module.exports = {
  name: "mute",
  description: "Mute a user.",
  options: [
    {
      name: "user",
      description: "The user you want to mute.",
      type: "USER",
      required: true,
    },
    {
      name: "duration",
      description: "The duration of the mute",
      type: "STRING",
      required: false,
      choices: [
        { name: "60 secs", value: "1m" },
        { name: "5 mins", value: "5m" },
        { name: "10 mins", value: "10m" },
        { name: "1 hour", value: "1hr" },
        { name: "8 hours", value: "8hrs" },
      ],
    },
    {
      name: "reason",
      description: "Provide the reason for the mute.",
      type: "STRING",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, member, options, guild } = interaction;
    const User = options.getMember("user");
    const Duration = options.getString("duration");
    const Reason = options.getString("reason") || "No reason provided.";

    let mutedRole = guild.roles.cache.find((r) => r.name === "Muted");

    if (!mutedRole) {
      try {
        mutedRole = await guild.roles.create({
          name: "Muted",
          color: "GREY",
          permissions: [],
        });
      } catch (err) {
        return interaction.reply({
          embeds: [
            errEmbed.setDescription(
              `There was an error while creating the muted role`
            ),
          ],
          ephemeral: true,
        });
      }
    }

    const errEmbed = new MessageEmbed().setColor("RED");

    if (User === member) {
      return interaction.reply({
        embeds: [
          errEmbed
            .setDescription(`You cannot mute yourself!`)
            .setFooter({ text: `Dumbo` }),
        ],
        ephemeral: true,
      });
    }

    if (!member.permissions.has("MANAGE_CHANNELS")) {
      return interaction.reply({
        content: [
          errEmbed.setDescription(
            `You do not have the permission \`MANAGE_CHANNELS\` to use this command!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (User.permissions.has("MANAGE_CHANNELS")) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `You cannot mute the person having \`MANAGE_CHANNELS\` permisson!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (User.roles.highest.position > guild.members.me.roles.highest.position) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(`The user has a higher role than me!`),
        ],
        ephemeral: true,
      });
    }

    if (User.roles.cache.has(mutedRole.id)) {
      return interaction.reply({
        embeds: [errEmbed.setDescription(`The user is already muted`)],
        ephemeral: true,
      });
    }

    if (User && !Duration) {
      try {
        guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(mutedRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            CONNECT: false,
          });
        });
        await User.roles.add(mutedRole);

        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`${User} has been muted for: **${Reason}**`)
              .setFooter({
                text: member.user.tag,
                iconURL: member.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });
      } catch (err) {
        return interaction.reply({
          content: [
            errEmbed.setDescription(
              `There was an error while running this command!`
            ),
          ],
        });
      }
    }

    if (User && Duration) {
      let duration = 0;

      switch (Duration) {
        case "1m":
          duration = 60;
          break;
        case "5m":
          duration = 300;
          break;
        case "10m":
          duration = 600;
          break;
        case "1hr":
          duration = 3600;
          break;
        case "8hrs":
          duration = 28800;
          break;
        default:
          return interaction.reply("Invalid duration choice");
      }

      try {
        const Expires = new Date(Date.now() + duration * 1000);

        const muteData = new MuteModel({
          UserID: User.id,
          GuildID: guild.id,
          Duration: duration,
          Expires: Expires,
        });
        await muteData.save();

        await User.roles.add(mutedRole);
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `${User} has been muted for **${Duration}** with the the reason **${Reason}**`
              )
              .setFooter({
                text: member.user.tag,
                iconURL: member.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });

        setTimeout(async () => {
          await User.roles.remove(mutedRole);
          await MuteModel.deleteOne({
            UserID: User.id,
            GuildID: guild.id,
          });
        }, duration * 1000);
      } catch (err) {
        return interaction.reply({
          content: [
            errEmbed.setDescription(
              `There was an error while running this command!`
            ),
          ],
        });
      }
    }
  },
};
