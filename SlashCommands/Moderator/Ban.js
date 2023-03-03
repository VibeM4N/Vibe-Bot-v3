const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a user from the server.",
  permission: "BAN_MEMBERS",
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
    const { options, user } = interaction;

    const User = options.getMember("user");
    const Reason = options.getString("reason") || "No Reason Provided.";

    const errEmbed = new MessageEmbed()
      .setColor("RED")
      .setFooter({
        text: `${user.username + "#" + user.discriminator}`,
        iconURL: user.avatarURL({ dynamic: true }),
      });

    if (!User)
      return interaction.reply({
        embeds: [
          errEmbed.setDescription("You have not mentioned the user to kick!"),
        ],
      });

    // kick
    try {
      await interaction.guild.members.ban(User, Reason);
      return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${User} has been kicked for the reason: \`${Reason}\``).setFooter({text: `${user.username}`, iconURL: user.avatarURL({dynamic: true})})]});
    } catch (e) {
      if (e) {
        console.error(e);
        return interaction.reply({content: `Failed to ban ${User.tag}`, ephemeral: true});
      }
    }
  },
};
