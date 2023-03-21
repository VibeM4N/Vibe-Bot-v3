const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlocks the current channel",
  options: [
    {
      name: "channel",
      description:
        "Provide the channel to lock else the current channel will be taken as default to lock.",
      required: false,
      type: "CHANNEL",
    },
    {
      name: "reason",
      description: "Provide the reason for locking the channel.",
      required: false,
      type: "STRING",
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {*} client
   */
  async execute(interaction, client) {
    const { channel, member, guild, options } = interaction;
    const Reason = options.getString("reason");
    const Channel = options.getChannel("channel") || channel;

    const successEmbed = new MessageEmbed().setColor("GREEN");
    const errEmbed = new MessageEmbed().setColor("RED");

    if (!member.permissions.has("MANAGE_CHANNELS")) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `❌ | You do not have the required permission: \`MANAGE_CHANNELS\` to run this command!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (
      Channel.permissionsFor(guild.roles.everyone.id).has(
        "SEND_MESSAGES" && "CONNECT",
        "ADD_REACTIONS"
      )
    ) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription("❌ | The channel is already unlocked!"),
        ],
        ephemeral: true,
      });
    }

    try {
      await Channel.permissionOverwrites.edit(guild.roles.everyone.id, {
        SEND_MESSAGES: true,
        CONNECT: true,
        ADD_REACTIONS: true,
      });

      const lockMessage = `🔓 | ${Channel} has been locked.
            \`Reason: ${Reason ? `${Reason}` : "No Reason Given"}\``;
      return interaction.reply({
        embeds: [
          successEmbed.setDescription(lockMessage).setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          }),
        ],
      });
    } catch (err) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            "An error occurred while locking the channel."
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
