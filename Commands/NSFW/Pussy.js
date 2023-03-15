const NSFW = require("discord-nsfw");
const { MessageEmbed } = require("discord.js");
const nsfw = new NSFW();

module.exports = {
  name: "pussy",
  category: "NSFW",
  run: async (client, message, args) => {
    const image = await nsfw.pussy();
    const embed = new MessageEmbed()
      .setTitle(`Pussy`)
      .setColor("RANDOM")
      .setImage(image);

    if (!message.channel.nsfw) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `\`This command contains NSFW content! Use it in NSFW channels!\``
            ),
        ],
      });
    } else {
      await message.channel.send({ embeds: [embed] });
    }
  },
};
