const Inhibitor = require("../modules/Base/Inhibitor");

module.exports = class VoiceChannel extends Inhibitor {
  constructor(...args) {
    super(...args);
  }

  run(msg, cmd) {
    if (!cmd.checkVC) return 1;

    if (!msg.member.voice) return msg.fail(`${msg.emojis.fail}You must join a voice channel before executing this command!`);

    if (msg.guild.player && msg.member.voice.channel && msg.guild.player.channelId && msg.member.voice.channel.id !== msg.guild.player.channelId) {
      return msg.fail(`${msg.emojis.fail}You must join #${msg.guild.channels.get(msg.guild.player.channelId).name} in order to execute this command!`);
    }

    return 1;
  }
};
