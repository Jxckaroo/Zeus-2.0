const Commando = require("discord.js-commando");
const { RichEmbed } = require('discord.js');
const Config = require("../../configs/config.json");
const Admins = Config.ADMINS;

class InRoleCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "in_role",
            group: "admin",
            memberName: "in_role",
            description: "Displays all the users inside of role passed in."
        });
    }

    hasPermission(msg) {
        if (!Admins.includes(msg.author.id)) {
            return "Only an admin can use the in_role command.";
        }
        return true;
    }

    async run(message, args) {
        if (message.channel.type === 'dm') {
            message.reply("You cannot use this command over DM.");
        } else {
            const role = message.guild.roles.find("name", message.content.replace(Config.PREFIX + "in_role ", ""));
            if (role !== null) {
                const ListEmbed = new RichEmbed()
                    .setTitle('Users with the ' + message.content.replace(Config.PREFIX + "in_role ", "") + ' role:')
                    .setAuthor("Zeus", "http://www.serenitygaming.eu/images/sg_logo_new.png")
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .setDescription(message.guild.roles.get(role.id).members.map(m => m.user.tag).join('\n'));
                message.channel.send(ListEmbed);
            } else {
                message.reply("Please enter a ***valid*** role.");
            }
        }
    }
}

module.exports = InRoleCommand;