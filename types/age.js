const Commando = require("discord.js-commando");

class AgeArgumentType extends Commando.ArgumentType {
    constructor(client) {
        super(client, 'age');
    }

    validate(val) {
        let isNumber = this.isNumber(val);

        if (isNumber) {
            if (parseFloat(val) >= 18) {
                return true;
            } else {
                return false;
            }
        }
    }

    static isNumber(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    }

    parse(val) {
        return val;
    }
}

module.exports = AgeArgumentType;