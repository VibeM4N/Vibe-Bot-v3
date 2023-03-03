const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  inVoiceChannel: true,
  run: async ({ client, message, args }) => {
    let voiceChannel = message.member.voice.channel;
    const songArg = args.join(" ");

    const { channel, member } = message;

    if (!songArg)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | Please enter a song url or query to search.`)
            .setFooter({
              text: message.user.username,
              iconURL: message.user.avatarURL({ dynamic: true }),
            }),
        ],
      });

    if (!voiceChannel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | You must be in a voice channel!`)
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (
      message.guild.me.voice.channelId &&
      voiceChannel.id !== message.guild.me.voice.channelId
    ) {
      const Embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `I am already in another Voice Channel: <#${message.guild.me.voice.channelId}>`
        )
        .setFooter({
          text: message.member.user.username,
          iconURL: message.member.user.avatarURL({ dynamic: true }),
        });
      return message.channel.send({ embeds: [Embed] });
    } else {
      return client.distube.play(voiceChannel, songArg, {
        textChannel: channel,
        member,
      });
      // return message.channel.send({
      //   embeds: [
      //     new MessageEmbed()
      //       .setColor("BLURPLE")
      //       .setDescription(`🎶 | Ready To Play Some Music!`)
      //       .setFooter({
      //         text: message.member.user.username,
      //         iconURL: message.member.user.avatarURL({ dynamic: true }),
      //       }),
      //   ],
      // });
    }
  },
};
