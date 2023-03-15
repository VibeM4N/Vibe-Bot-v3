const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "join",
  category: "Music",
  aliases: ["move"],
  run: async ( client, message, args ) => {
    let voiceChannel = message.member.voice.channel;

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
    } else if (
      message.guild.me.voice.channelId &&
      voiceChannel.id === message.guild.me.voice.channelId
    ) {
      return message.channel.send({
        emebds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("I am already in the same Voice Channel as yours!")
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    } else {
      await client.distube.voices.join(voiceChannel);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`🎶 | Ready To Play Some Music!`)
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.user.avatarURL({ dynamic: true }),
            }),
        ],
      });
    }
  },
};
