const Commando = require("discord.js-commando");

class CoinFlipCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "coin_flip",
            group: "member",
            memberName: "coin_flip",
            description: "Flips a coin, landing on either heads or tails."
        });
    }

    async run(message) {
        let chance = Math.floor(Math.random() * 2);

        if (chance == 0) {
            message.reply("The coin landed on heads!");
        } else {
            message.reply("The coin landed on tails!");
        }
    }
}

module.exports = CoinFlipCommand;