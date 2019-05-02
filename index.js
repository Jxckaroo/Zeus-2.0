const Commando = require("discord.js-commando");
const path = require("path");
const Config = require("./configs/config.json");
const BOT_TOKEN = Config.TOKEN;

// Instantiate the bot
const bot = new Commando.Client({
    commandPrefix: Config.PREFIX,
    owner: Config.OWNER,
    disableEveryone: true,
});

bot.registry
    .registerDefaultTypes()
    .registerGroups([
        ['member', 'Member Commands'],
        ['admin', 'Administrative Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

bot.on("ready", () => {
    console.log('Logged in!');
    bot.user.setActivity(Config.ACTIVITY);
});

bot.login(BOT_TOKEN);