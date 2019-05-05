const Commando = require("discord.js-commando");
const Config = require("../../configs/config.json");
const mysql = require('mysql');
const con = mysql.createConnection({
    host: Config.DB.HOST,
    user: Config.DB.USER,
    password: Config.DB.PASSWORD,
    database: Config.DB.DATABASE
});
const Admins = Config.ADMINS;

class DeclineApplicationCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "decline_application",
            group: "admin",
            memberName: "decline_application",
            description: "Decline a member application.",
            args: [{
                key: "applicant",
                prompt: "Which user would you like to decline?",
                type: "user",
                wait: 240
            }]
        });
    }

    hasPermission(msg) {
        if (!Admins.includes(msg.author.id)) {
            return "Only an admin can use the decline_application command.";
        }
        return true;
    }

    async run(message, { applicant }) {
        const recruitRole = message.guild.roles.find("name", "Recruit");
        let member = message.guild.members.get(applicant.id);

        member.removeRole(recruitRole).catch(err => "Error remove role from user ID " + applicant.id + ". Error was: " + err + "\n");

        message.channel.send("I have declined that user.");
        member.send("Unfortunately, you have been declined full time membership" +
            " at " + Config.DISCORD_NAME + ". We have removed your recruit role at this time." +
            " If you would like to re-apply, simply submit another application and" +
            " stick to the guidelines to become a member.");

        // Update application status
        let response = await result.forEach(async(element, i) => {
            await con.query('UPDATE applications SET status = ?', "Declined", async function(err, result) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
        });
    }
}

module.exports = DeclineApplicationCommand;