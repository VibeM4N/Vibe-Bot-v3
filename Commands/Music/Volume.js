const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "volume",
  category: "Music",
  aliases: ["v", "set-volume", "set-v", "vol"],
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);
    const ErrEmbed = new MessageEmbed().setColor("RED");
    let voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.channel.send({
        embeds: [
          ErrEmbed.setDescription(
            `❌ | You must be in a voice channel!`
          ).setFooter({
            text: message.member.user.username,
            iconURL: message.member.user.avatarURL({ dynamic: true }),
          }),
        ],
      });
    }

    if (
      message.guild.members.me.voice.channelId &&
      voiceChannel.id !== message.guild.members.me.voice.channelId
    ) {
      const Embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `I am in another Voice Channel: <#${message.guild.members.me.voice.channelId}>`
        )
        .setFooter({
          text: message.member.user.username,
          iconURL: message.member.user.avatarURL({ dynamic: true }),
        });
      return message.channel.send({ embeds: [Embed] });
    }

    if (!queue)
      return message.channel.send({
        embeds: [
          ErrEmbed.setDescription(
            `❌ | There is nothing in the queue right now!`
          ),
        ],
      });

    const volume = parseInt(args[0]);
    if (isNaN(volume)) {
      return message.channel.send({
        embeds: [ErrEmbed.setDescription(`❌ | Please enter a valid number!`)],
      });
    }

    if (volume > 100 || volume <= 0) {
      return message.reply({
        embeds: [
          ErrEmbed.setDescription(`You can only set volume between \`1-100\``),
        ],
      });
    } else {
      queue.setVolume(volume);
    }

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(`❌ | Volume set to \`${volume}\``),
      ],
    });
  },
};
