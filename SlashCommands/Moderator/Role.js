// const { CommandInteraction, MessageEmbed } = require("discord.js");

// module.exports = {
//   name: "role",
//   description: "Add the specified role to the user.",
//   options: [
//     {
//       name: "user",
//       description: "Select the user you want to add the role to.",
//       type: "USER",
//       required: true,
//     },
//     {
//       name: "role",
//       description: "Select the role you want to add to add to the user",
//       type: "ROLE",
//       required: true,
//     },
//   ],
//   /**
//    *
//    * @param {CommandInteraction} interaction
//    */
//   async(interaction) {
//     const { options, member } = interaction;
//     const User = options.getMember("user");
//     const Role = options.getRole("role");

//     const errEmbed = new MessageEmbed().setColor("RED");

//     if (!User && !Role) {
//       return interaction.reply({
//         embeds: [
//           errEmbed.setDescription(`You must specify the user and the role!`),
//         ],
//       });
//     }

//     if(User.roles.highest.position > member.roles.highest.position){
//         return interaction.reply({embeds: [err]})
//     }
//     if (member.permissions.has("MANAGE_ROLES")) {
//       return interaction.reply({
//         embeds: [
//           errEmbed.setDescription(
//             `You do not have the permission \`MANAGE_ROLES\` to use this command!`
//           ),
//         ],
//       });
//     }

//     try {
//       User.roles.add(Role);
//     } catch (err) {
//       interaction.reply({
//         embeds: [
//           errEmbed.setDescription(
//             `There was an error whhile running this command!`
//           ),
//         ],
//       });
//     }
//   },
// };

// commands/role.js

const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "role",
  description: "Add, remove, or create a role.",
  options: [
    {
      name: "add",
      description: "Add a role to a member.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "member",
          description: "The member to add the role to.",
          type: "USER",
          required: true,
        },
        {
          name: "role",
          description: "The role to add.",
          type: "ROLE",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a role from a member.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "member",
          description: "The member to remove the role from.",
          type: "USER",
          required: true,
        },
        {
          name: "role",
          description: "The role to remove.",
          type: "ROLE",
          required: true,
        },
      ],
    },
    {
      name: "create",
      description: "Create a new role.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "name",
          description: "The name of the role to create.",
          type: "STRING",
          required: true,
        },
        {
          name: "color",
          description:
            "The color of the role (optional). Also make sure you enter the color's hexcode!",
          type: "STRING",
          required: false,
        },
        {
          name: "mentionable",
          description:
            "This allows members to mention this role. This is off by default.",
          type: "BOOLEAN",
          required: false,
        },
        {
          name: "hoist",
          description:
            "Display role members seperately from online members. Default is false.",
          type: "BOOLEAN",
          required: false,
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, member, guild } = interaction;
    const User = options.getMember("user");
    const subcommand = interaction.options.getSubcommand();

    const errEmbed = new MessageEmbed().setColor("RED");

    if (!guild.members.me.permissions.has("MANAGE_ROLES")) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `I do not have the permission \`MANAGE_ROLES\` to run this command!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (!member.permissions.has("MANAGE_ROLES")) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription(
            `You do not have the permission \`MANAGE_ROLES\` to run this command!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (User === guild.members.me) {
      return interaction.reply({
        embeds: [
          errEmbed.setDescription("Why?").setFooter({
            text: Dumbo,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          }),
        ],
        ephemeral: true,
      });
    }

    switch (subcommand) {
      case "add":
        const addMember = options.getMember("member");
        const addRole = options.getRole("role");

        if (!addMember) {
          return interaction.reply({
            embeds: [errEmbed.setDescription("Please provide a valid member.")],
            ephemeral: true,
          });
        }

        if (!addRole) {
          return interaction.reply({
            embeds: [errEmbed.setDescription("Please provide a valid role.")],
            ephemeral: true,
          });
        }

        if (addRole.position > guild.members.me.roles.highest.position) {
          return interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `The role to add is at a higher postion than that of my role!`
              ),
            ],
            ephemeral: true,
          });
        }

        if (addMember.roles.cache.has(addRole.id)) {
          return interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `${addMember} already has the **${addRole.name}** role.`
              ),
            ],
            ephemeral: true,
          });
        }

        try {
          await addMember.roles.add(addRole);
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("GREEN")
                .setDescription(
                  `Added the **${addRole.name}** role to ${addMember}.`
                ),
            ],
            ephemeral: true,
          });
        } catch (err) {
          await interaction.reply({
            embeds: [
              errEmbed.setDescription(
                "An error occurred while adding the role."
              ),
            ],
            ephemeral: true,
          });
        }
        break;

      case "remove":
        const removeMember = interaction.options.getMember("member");
        const removeRole = interaction.options.getRole("role");

        if (!removeMember) {
          return interaction.reply({
            embeds: [errEmbed.setDescription("Please provide a valid member.")],
            ephemeral: true,
          });
        }

        if (!removeRole) {
          return interaction.reply({
            embeds: [errEmbed.setDescription("Please provide a valid role.")],
            ephemeral: true,
          });
        }

        if (removeRole.position.highest > guild.members.me.roles.highest) {
          return interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `The role to remove is at a higher postion than that of my role!`
              ),
            ],
            ephemeral: true,
          });
        }

        if (!removeMember.roles.cache.has(removeRole.id)) {
          return interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `${removeMember} does not have the **${removeRole.name}** role.`
              ),
            ],
            ephemeral: true,
          });
        }

        try {
          await removeMember.roles.remove(removeRole);
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("GREEN")
                .setDescription(
                  `Removed the **${removeRole.name}** role from ${removeMember}.`
                ),
            ],
            ephemeral: true,
          });
        } catch (err) {
          return interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `There was error while removing the role`
              ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "create":
        const roleName = interaction.options.getString("name");
        let roleColor = interaction.options.getString("color").toLowerCase();
        const roleMentionable = interaction.options.getBoolean("mentionable");
        const roleHoist = interaction.options.getBoolean("hoist") || false;

        const colorNamesToHex = {
          red: "#FF0000",
          orange: "#FFA500",
          yellow: "#FFFF00",
          green: "#008000",
          blue: "#0000FF",
          purple: "#800080",
          pink: "#FFC0CB",
          brown: "#A52A2A",
          black: "#000000",
          white: "#FFFFFF",
          gray: "#808080",
          cyan: "#00FFFF",
        };

        if (colorNamesToHex.hasOwnProperty(roleColor)) {
          roleColor = colorNamesToHex[roleColor];
        }

        const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
        if (roleColor && !hexRegex.test(roleColor)) {
          return interaction.reply(
            `${roleColor} is not a valid hex color code. Make sure to enter a color's hexcode or enter a color which are common!`
          );
        }

        try {
          await guild.roles.create({
            name: roleName,
            color: roleColor,
            permissions: "SEND_MESSAGES",
            mentionable: roleMentionable,
            hoist: roleHoist,
          });

          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`Role **${roleName}** has been created.`),
            ],
            ephemeral: true,
          });
        } catch (err) {
          interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `There was an error while creating the command!`
              ),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
};
