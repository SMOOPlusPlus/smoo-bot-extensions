//Bot Vars
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
//Bot Configs
const { testtoken, token } = require("../config/token.json");
const cfg = require("../config/config.json")
// defines client and calls
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials
const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
});
client.config = require("../config/config.json")
client.logger = require("../Handlers/logger.js")
client.timerList = [];
//Bot Imports
const { loadEvents } = require("../Handlers/Events.js")
const { loadSlashCommands } = require("../Handlers/CommandHandler.js")
if(client.config.anticrash === true) require("../Events/AntiCrash/bot.js.dl")(client)
//Commands Collections
client.commands = new Collection()
//Logs the bot in when ready
if(cfg.debug === true) {
    client.login(testtoken).then(() => { loadEvents(client); loadSlashCommands(client) })
} else {
    client.login(token).then(() => { loadEvents(client); loadSlashCommands(client) })
}
