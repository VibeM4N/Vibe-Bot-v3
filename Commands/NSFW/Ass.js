const NSFW = require("discord-nsfw");
const { MessageEmbed } = require("discord.js");
const nsfw = new NSFW();

module.exports = {
  name: "ass",
  category: "NSFW",
  run: async (client, message, args) => {
    const image = await nsfw.ass();
    const embed = new MessageEmbed()
      .setTitle(`Ass`)
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
