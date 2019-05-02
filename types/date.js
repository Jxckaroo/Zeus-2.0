const Commando = require("discord.js-commando");

class DateArgumentType extends Commando.ArgumentType {
    constructor(client) {
        super(client, 'date');
    }

    validate(val) {
        var m = val.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/);
        return m[2] && m[2] == '/';
    }

    parse(val) {
        return val;
    }
}

module.exports = DateArgumentType;