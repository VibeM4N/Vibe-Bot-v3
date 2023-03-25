const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  category: "Music",
  run: async ( client, message, args ) => {
    const queue = client.distube.getQueue(message);
    let voiceChannel = message.member.voice.channel;

    if (!queue)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | There is nothing in the queue right now!`)
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
      
    if (message.guild.members.me.voice.channel === message.member.voice.channel) {
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | I am not in the same Voice Channel as yours!`)
            .setFooter({
              text: message.member.user.username,
              iconURL: message.member.displayAvatarURL({ dynamic: true }),
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
      try {
        const song = await queue.skip();
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`✅ | Skipped! Now playing:\n${song.name}`)
              .setFooter({
                text: message.member.user.username,
                iconURL: message.member.user.avatarURL({ dynamic: true }),
              }),
          ],
        });
      } catch (e) {
        message.channel.send(`❌ | An error occurred while running this command!`);
      }
    }
  },
};
