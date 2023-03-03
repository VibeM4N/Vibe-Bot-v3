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
    const { options, member, user } = interaction;

    const User = options.getMember("user");
    const Reason = options.getString("reason") || "No Reason Provided.";

    const errEmbed = new MessageEmbed()
      .setColor("RED")
      .setFooter({
        text: `${member.user.username + "#" + member.user.discriminator}`,
        iconURL: member.user.avatarURL({ dynamic: true }),
      });

    if (!User)
      return interaction.reply({
        embeds: [
          errEmbed.setDescription("You have not mentioned the user to kick!"),
        ],
      });

    // kick
    try {
      await interaction.guild.members.kick(User, Reason);
      return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${User} has been kicked for the reason: \`${Reason}\``).setFooter({text: `${user.username}`, iconURL: user.avatarURL({dynamic: true})})]});
    } catch (e) {
      if (e) {
        console.error(e);
        return interaction.reply(`Failed to kick ${User.tag}`);
      }
    }
  },
};
