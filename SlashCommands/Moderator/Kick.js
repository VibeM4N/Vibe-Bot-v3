const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicks a user from the server.",
  permission: "KICK_MEMBERS",
  options: [
    {
      name: "user",
      description: "The user to kick.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "reason for the punishment.",
      type: "STRING",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guild, member } = interaction;

    const User = options.getMember("user");
    const Reason = options.getString("reason") || "No Reason Provided.";

    const errEmbed = new MessageEmbed().setColor("RED").setFooter({
      text: `${member.user.tag}`,
      iconURL: member.displayAvatarURL({ dynamic: true }),
    });

    if (!member.permissions.has("KICK_MEMBERS")) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `You do not have permission \`KICK_MEMBERS\` to kick a user!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (User === guild.me) {
      return interaction.reply({
        embeds: [errEmbed.setDescription("❌ | YOU CANNOT KICK ME!")],
        ephemeral: true,
      });
    }

    if (member === User) {
      return interaction.reply({
        embeds: [
          errEmbed
            .setDescription(`You cannot kick yourself!`)
            .setFooter({
              text: `Dumbo`,
              iconURL: member.displayAvatarURL({ dynamic: true }),
            }),
        ],
        ephemeral: true,
      });
    }

    if (guild.me.roles.highest.position < User.roles.highest.position) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(`❌ | The user has a higher role than me!`),
        ],
        ephemeral: true,
      });
    }

    if (member.roles.highest.position < User.roles.highest.position) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `❌ | The user you are trying to kick has a higher than you!`
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      await guild.members.kick(User, { reason: Reason });
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `${User} has been kicked for the reason: \`${Reason}\``
            )
            .setFooter({
              text: `Kicked by: ${member.user.tag}`,
              iconURL: member.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } catch (e) {
      console.log(e);
      if (e) {
        return interaction.reply({
          content: `There was error while kicking ${User}`,
          ephemeral: true,
        });
      }
    }

    try {
      await User.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `You have been kicked in \`${guild.name}\` for \`$${Reason}\``
            ),
        ],
      });
    } catch (err) {
      throw err;
    }
  },
};
