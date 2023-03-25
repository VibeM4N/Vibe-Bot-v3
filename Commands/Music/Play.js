const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "play",
  category: "Music",
  aliases: ["p"],
  run: async ( client, message, args ) => {
    let voiceChannel = message.member.voice.channel;
    const songArg = args.join(" ");

    const { channel, member } = message;

    if (!songArg)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | Please enter a song url or name to search.`)
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.displayAvatarURL({ dynamic: true }),
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
      message.guild.members.me.voice.channelId &&
      voiceChannel.id !== message.guild.members.me.voice.channelId
    ) {
      const Embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `I am already in another Voice Channel: <#${message.guild.members.me.voice.channelId}>`
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
     
    }
  },
};
