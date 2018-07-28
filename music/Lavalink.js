const EventEmitter = require("events");
const WebSocket = require("ws");

module.exports = class Lavalink extends EventEmitter {
  constructor(client, options = {}) {
    super();
    this.client = client;
    this.id = options.id || "415313696102023169";
    this.shards = options.shard || 1;
    this.host = options.host || "localhost";
    this.port = options.port || 80;
    this.APIport = options.APIport || 2333;

    this.ws = new WebSocket(`ws://${this.host}:${this.port}`, {
      headers: {
        "User-Id": this.id,
        "Num-Shards": this.shards,
        "Authorization": options.password || "youshallnotpass"
      }
    });
    this.ws.on("message", this._message.bind(this));
    this.ws.on("error", this._error.bind(this));
    this.ws.on("close", () => this.ws = null);

    this.client.on("raw", packet => {
      if (packet.t === "VOICE_SERVER_UPDATE") this._sendVoiceUpdate(packet.d);
    });
  }

  send(obj) {
    if (!isNaN(obj.op)) this.client.ws.send(obj); // If it is a number, then send it to client ws.
    else this.ws.send(JSON.stringify(obj)); // Send it to Lavalink.
  }

  _message(msg) {
    const data = JSON.parse(msg);

    if (data.op === "stats") return this.stats = data;
    if (data.reason === "LOAD_FAILED") return this._error("Failed to load this track!");

    if (!this.client.guilds.has(data.guildId)) return;

    const guild = this.client.guilds.get(data.guildId);

    if (data.reason === "REPLACED") return;
    if (data.reason === "FINISHED") return this.emit("finished", guild);
  }

  _error(err) {
    return this.emit(err);
  }

  _sendVoiceUpdate(packet) {
    const guild = this.client.guilds.get(packet.guild_id);
    if (!guild) this._error("Guild not found!");
    return this.send({
      "op": "voiceUpdate",
      "guildId": packet.guild_id,
      "sessionId": guild.me.voiceSessionID,
      "event": packet
    });
  }
};