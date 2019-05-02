const Commando = require("discord.js-commando");

class NumberArgumentType extends Commando.ArgumentType {
    constructor(client) {
        super(client, 'number');
    }

    validate(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    }

    parse(val) {
        return val;
    }
}

module.exports = NumberArgumentType;