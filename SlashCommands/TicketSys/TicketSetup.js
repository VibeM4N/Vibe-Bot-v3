const {
  MessageEmbed,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const DB = require("../../Structures/Schemas/TicketSetup");

module.exports = {
  name: "ticketsetup",
  description: "Setup ticket",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      description: "Select a ticket creation channel.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "category",
      description: "Select the ticket creation channel's category.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_CATEGORY"],
    },
    {
      name: "transcripts",
      description: "Select the transcripts channel.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "description",
      description: "Set the description of the ticket creation channel.",
      required: true,
      type: "STRING",
    },
    {
      name: "button",
      description: `Give the button a name.`,
      required: true,
      type: "STRING",
    },
    {
      name: "emoji",
      description: `Give the button an emoji.`,
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
    const { guild, options, member } = interaction;

    try {
      const Channel = options.getChannel("channel");
      const Category = options.getChannel("category");
      const Transciprts = options.getChannel("transcripts");
      const Everyone = guild.roles.everyone;
      const ModeratorRole = guild.roles.cache.find(
        (r) => r.name === "Ticket-Moderator"
      );

      try {
        if (ModeratorRole) {
          await member.roles.add(ModeratorRole.id);
        } else {
          guild.roles
            .create({
              name: "Ticket-Moderator",
              color: "NOT_QUITE_BLACK",
            })
            .then(async (role) => {
              await member.roles.add(role).catch((err) => {
                return interaction.reply({
                  content: "Failed to add the Ticket Moderator role to you!",
                });
              });
            })
            .catch((err) => {
              console.log(err);
              return interaction.reply({
                content:
                  "There was error creating the moderator role for the Ticket!",
              });
            });
        }
      } catch (err) {
        return interaction.reply({
          content:
            "There was an error adding the Ticket Moderator role to you!",
        });
      };

      const Description = options.getString("description");
      const Button = options.getString("button");

      const Emoji = options.getString("emoji").trimEnd() || "";

      await DB.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: Channel.id,
          Category: Category.id,
          Transciprts: Transciprts.id,
          ModeratorRole: ModeratorRole.id,
          Everyone: Everyone.id,
          Description: Description,
          Buttons: [Button],
        },
        { new: true, upsert: true }
      );

      const Buttons = new MessageActionRow();
      Buttons.addComponents(
        new MessageButton()
          .setCustomId(Button)
          .setLabel(Button)
          .setStyle("PRIMARY")
          .setEmoji(Emoji)
      );

      const Embed = new MessageEmbed()
        .setAuthor({
          name: guild.name + " | Ticket System",
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(Description)
        .setColor("NOT_QUITE_BLACK");

      await guild.channels.cache
        .get(Channel.id)
        .send({ embeds: [Embed], components: [Buttons] });

      interaction.reply({ content: "Created a Ticket", ephemeral: true });
    } catch (err) {
      // console.log(err);
      const errEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `⛔ | An error accured whil setting up your ticket system\n**Make sure that**
            1. Make sure that the button name does not exceed 200 characters.
            2. Make sure that your button emojis are actual emojis and not ids of the emoji.
            3. Make sure that you give a valid emoji in the emoji option.`
        )
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        });
      interaction.reply({ embeds: [errEmbed] });
    }
  },
};
