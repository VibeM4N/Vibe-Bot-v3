const { ButtonInteraction, MessageEmbed } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const DB = require("../../Structures/Schemas/TicketDB");
const TicketSetupData = require("../../Structures/Schemas/TicketSetup");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const { guild, customId, channel, member } = interaction;

    const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
    if (!TicketSetup)
      return interaction.reply({
        content: "The data for the system is outdated",
        ephemeral: true,
      });

    if (!["close", "unlock", "lock"].includes(customId)) return;

    if (!member.roles.cache.find((r) => r.id === TicketSetup.ModeratorRole))
      return interaction.reply({
        content: "These buttons are for staff only",
        ephemeral: true,
      });

    const Embed = new MessageEmbed().setColor("RANDOM");

    DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
      if (err) throw err;
      if (!docs)
        return interaction.reply({
          content:
            "No data was found related to this ticket, please delete manually.",
        });
      switch (customId) {
        case "lock":
          if (docs.Locked == true)
            return interaction.reply({
              content: "The ticket is already locked",
              ephemeral: true,
            });
          await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
          Embed.setDescription("🔐 | The ticket has been locked");

          docs.MembersID.forEach((m) => [
            channel.permissionOverwrites.edit(m, {
              SEND_MESSAGES: false,
            }),
          ]);

          interaction.reply({ embeds: [Embed] });
          break;
        case "unlock":
          if (docs.Locked == false)
            return interaction.reply({
              content: "The ticket is already unlocked",
              ephemeral: true,
            });
          await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
          Embed.setDescription("🔓 | The ticket has been unlocked");

          docs.MembersID.forEach((m) => [
            channel.permissionOverwrites.edit(m, {
              SEND_MESSAGES: true,
            }),
          ]);

          interaction.reply({ embeds: [Embed] });
          break;
        case "close":
          if (docs.Closed == true)
            return interaction.reply({
              content: "Ticket is already closed, wait for it to get deleted",
              ephemeral: true,
            });
          const attachment = await createTranscript(channel, {
            limit: -1,
            returnBufer: false,
            __filename: `${docs.Type} + ${docs.TicketID}.html`,
          });
          await DB.updateOne({ ChannelID: channel.id }, { Closed: true });

          const Message = await guild.channels.cache
            .get(TicketSetup.Transciprts)
            .send({
              embeds: [
                Embed.setTitle(
                  `Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`
                ),
              ],
              files: [attachment],
            });
          interaction.reply({
            embeds: [
              Embed.setDescription(
                `The transcript is now saved [TRANSCRIPT](${Message.url})`
              ),
            ],
          });

          setTimeout(() => {
            channel.delete().catch(() => {});
          }, 10 * 1000);
          break;
      }
    });
  },
};
