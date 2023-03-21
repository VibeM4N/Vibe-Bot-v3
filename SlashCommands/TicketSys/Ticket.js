const { MessageEmbed, CommandInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/TicketDB");

module.exports = {
    name: "ticket",
    description: "Ticket Actions.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "action",
            type: "STRING",
            description: "Add or Remove a member from this ticket.",
            required: true,
            choices: [
                { name: "Add", value: "add" },
                { name: "Remove", value: "remove" },
            ],
        },
        {
            name: "member",
            description: "Select a member.",
            type: "USER",
            required: true,
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guildId, options, channel } = interaction;
        const Action = options.getString("actions");
        const Member = options.getMember("member");

        const Embed = new MessageEmbed();

        switch (Action) {
            case "add":
                DB.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, docs) => {
                    if (err) throw err;
                    if (!docs) return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("❌ | This channel is not part of a ticket!")], ephemeral: true });
                    if (docs.MemberID.includes(Member.id)) return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("❌ | This member is already added to the ticket!")], ephemeral: true })
                    docs.MemberID.push(Member.id);

                    channel.permissionOverwrites.edit(Member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    interaction.reply({ emebds: [Embed.setColor("GREEN").setDescription(`✅ | ${Member} has been added to this ticket!`)] })
                    docs.save();
                });
                break;
            case "remove":
                DB.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, docs) => {
                    if (err) throw err;
                    if (!docs)
                        return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("❌ | This channel is not part of a ticket!")], ephemeral: true });
                    if (!docs.MemberID.includes(Member.id))
                        return interaction.reply({ embeds: [Embed.setColor("RED").setDescription("❌ | This member is not in this ticket!")], ephemeral: true })
                    docs.MemberID.push(Member.id);

                    channel.permissionOverwrites.edit(Member.id, {
                        VIEW_CHANNEL: false
                    });

                    interaction.reply({ emebds: [Embed.setColor("GREEN").setDescription(`✅ | ${Member} has been removed from this ticket!`)] })
                });
                break;
        }
    }
}
