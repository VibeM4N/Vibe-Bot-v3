const NSFW = require("discord-nsfw");
const { MessageEmbed, Message } = require("discord.js");
const nsfw = new NSFW();

module.exports = {
  name: "4k",
  category: "NSFW",
  aliases: ["fourk"],
  run: async (client, message, args) => {
    const image = await nsfw.fourk();
    const embed = new MessageEmbed()
      .setTitle(`4K`)
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
