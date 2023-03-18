const NSFW = require("discord-nsfw");
const { MessageEmbed } = require("discord.js");
const nsfw = new NSFW();

module.exports = {
  name: "hentaithigh",
  category: "NSFW",
  aliases: ["hentai-thigh"],
  run: async (client, message, args) => {
    const image = await nsfw.hentaithigh();
    const embed = new MessageEmbed()
      .setTitle(`Hentai Thigh`)
      .setColor("RANDOM")
      .setImage(image);

    if (!message.channel.nsfw) {
      return await message.channel.send({
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
