const { Message, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "unmute",
  description: "Unmute a user.",
  options: [
    {
      name: "user",
      description: "The user you want to unmute.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Provide the reason for the unmute.",
      type: "STRING",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { member, options, guild } = interaction;
    const User = options.getMember("user");
    const Reason = options.getString("reason") || "No reason provided.";
    const errEmbed = new MessageEmbed().setColor("RED");

    let mutedRole = guild.roles.cache.find((r) => r.name === "Muted");

    if (!mutedRole) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `There is no one muted in the server. Use /mute to mute an user!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (User === member) {
      return interaction.reply({
        embeds: [
          errEmbed
            .setDescription(`You cannot unmute yourself!`)
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

    if (!User.roles.cache.has(mutedRole.id)) {
      return interaction.reply({
        embeds: [errEmbed.setDescription(`The user is already unmuted`)],
        ephemeral: true,
      });
    }

    try {
      await User.roles.remove(mutedRole);

      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${User} has been unmuted for: **${Reason}**`)
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
  },
};
