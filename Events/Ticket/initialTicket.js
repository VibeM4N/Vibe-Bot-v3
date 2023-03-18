const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/TicketDB");
const { PAERNTID, EVERYONEID } = require("../../Structures/config.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const { guild, member, customId } = interaction;

        if (!["player", "bug", "other"].includes(customId)) return;

        const ID = Math.floor(Math.random() * 90000) + 10000;

        await guild.channels.create(`${customId + "-" + ID}`, {
            type: "GUILD_TEXT",
            parent: PAERNTID,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: EVERYONEID,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"]
                },
            ],
        }).then(async (channel) => {
            await DB.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId
            });

            const Embed = new MessageEmbed()
                .setAuthor({ name: guild.name + ` | Ticket: ${ID}`, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription("Please wait patiently for a response from the staff!")
                .setFooter({ text: "These buttons are only for the staff" });

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                    .setCustomId("close")
                    .setLabel("Save and close ticket")
                    .setStyle("PRIMARY")
                    .setEmoji("📂"),
                new MessageButton()
                    .setCustomId("lock")
                    .setLabel("Lock")
                    .setStyle("SECONDARY")
                    .setEmoji("🔐"),
                new MessageButton()
                    .setCustomId("unlock")
                    .setLabel("Unlock")
                    .setStyle("SUCCESS")
                    .setEmoji("🔓")
            );

            channel.send({ embeds: [Embed], components: [Buttons] });
            channel.send({ content: `${member} here is your ticket` }).then((m) => [
                setTimeout(() => {
                    m.delete().catch(() => { });
                }, 1 * 5000)
            ])

            interaction.reply({ content: `${member} your ticket has been created: ${channel}`, ephemeral: true });
        });
    }
}