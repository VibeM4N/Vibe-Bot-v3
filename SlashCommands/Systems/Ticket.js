const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const { CHANNELID } = require("../../Structures/config.json");

module.exports = {
    name: "ticket",
    description: "Setup ticket",
    permission: "ADMINISTRATOR",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const Embed = new MessageEmbed()
            .setAuthor({ name: guild.name + " | Ticket System", iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription("Open a ticket!")
            .setColor("RANDOM");

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                .setCustomId("player")
                .setLabel("Player Report")
                .setStyle("PRIMARY")
                .setEmoji("👌"),
                new MessageButton()
                .setCustomId("bug")
                .setLabel("Bug Report")
                .setStyle("SECONDARY")
                .setEmoji("🐛"),
                new MessageButton()
                .setCustomId("other")
                .setLabel("Other Report")
                .setStyle("SUCCESS")
                .setEmoji("⏰")
            );

            await guild.channels.cache.get(CHANNELID).send({embeds: [Embed], components: [Buttons]});

            interaction.reply({content: "done", ephemeral: true})
    }
}