
const Inhibitor = require("../modules/Inhibitor");

module.exports = class GuildDisabled extends Inhibitor {
  constructor(...args) {
    super(...args);
  }

  run(msg, cmd) {
    if (!msg.guild || !msg.guild.cache || !msg.guild.cache.disabledCommands) return 1;
    if (msg.guild.cache.disabledCommands.includes(cmd.options.name)) return msg.fail(`Sorry ${msg.author.username}, this command is disabled in this guild!`);
    return 1;
  }
};