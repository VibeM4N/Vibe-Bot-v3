const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/TicketSetup");

module.exports = {
  name: "ticket-moderator",
  description: "Add or remove the ticket moderator role.",
  options: [
    {
      name: "action",
      description: "Add or Remove a member from this ticket.",
      type: "STRING",
      required: true,
      choices: [
        { name: "Add", value: "add" },
        { name: "Remove", value: "remove" },
      ],
    },
    {
      name: "member",
      description: "Choose the member you want to add the ticket moderator role",
      type: "USER",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, member, guild, options } = interaction;

    const Actions = options.getString("action");
    const User = options.getMember("user");

    const errEmbed = new MessageEmbed().setColor("RED");

    switch (Actions) {
      case "add":
        DB.findOne({ GuildID: guild.id }, async (err, docs) => {
          if (err) throw err;
          if (!docs)
            return interaction.reply({
              content: "The data for the system is outdated!",
              ephemeral: true,
            });
          console.log(docs);
          if (!docs.Channel) {
            return interaction.reply({
              embeds: [
                errEmbed.setDescription(
                  `A ticket system was never setup to retrieve the ticket moderator role!`
                ),
              ],
              ephemeral: true,
            });
          }

          if (User.roles.cache.has(docs.ModeratorRole)) {
            return interaction.reply({
              embeds: [
                errEmbed.setDescription(
                  `${User} already has the ticket moderator role!`
                ),
              ],
              ephemeral: true,
            });
          }

          try {
            await User.roles.add(docs.ModeratorRole);
            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("GREEN")
                  .setDescription(
                    `Successfully added the ticket moderator role to ${User}`
                  ),
              ],
              ephemeral: true,
            });
          } catch (err) {
            console.log(err);
            interaction.reply({
              embeds: [
                errEmbed.setDescription(
                  `There was an error while adding the role!`
                ),
              ],
            });
          }
        });
        break;
      case "remove":
        DB.findOne({ GuildID: guild.id }, async (err, docs) => {
          if (err) throw err;
          if (!docs)
            return interaction.reply({
              content: "The data for the system is outdated!",
              ephemeral: true,
            });
          console.log(docs);
          if (!docs.Channel) {
            return interaction.reply({
              embeds: [
                errEmbed.setDescription(
                  `A ticket system was never setup to retrieve the ticket moderator role!`
                ),
              ],
              ephemeral: true,
            });
          }

          if (!User.roles.cache.has(docs.ModeratorRole)) {
            return interaction.reply({
              embeds: [
                errEmbed.setDescription(
                  `${User} does not have the ticket moderator role!`
                ),
              ],
              ephemeral: true,
            });
          }

          try {
            await User.roles.remove(docs.ModeratorRole);
            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("GREEN")
                  .setDescription(
                    `Successfully removed the ticket moderator role from ${User}`
                  ),
              ],
              ephemeral: true,
            });
          } catch (err) {
            console.log(err);
            interaction.reply({
              embeds: [
                errEmbed.setDescription(
                  `There was an error while removing the role!`
                ),
              ],
            });
          }
        });
        break;
    }
  },
};
