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

class AcceptApplicationCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "accept_application",
            group: "admin",
            memberName: "accept_application",
            description: "Accept a member application.",
            args: [{
                key: "applicant",
                prompt: "Which user would you like to accept?",
                type: "user",
                wait: 240
            }]
        });
    }

    hasPermission(msg) {
        if (!Admins.includes(msg.author.id)) {
            return "Only an admin can use the accept_application command.";
        }
        return true;
    }

    async run(message, { applicant }) {
        console.log("User ID: " + message.author.id + " accepted user: " + applicant.id + "\n");
        const memberRole = message.guild.roles.find("name", "Member");
        const recruitRole = message.guild.roles.find("name", "Recruit");
        let member = message.guild.members.get(applicant.id),
            nick   = 'SG | ' + member.displayName || '';

        member.addRole(memberRole).catch(err => console.log("Error adding member role to user: " + applicant.id + " Error was: " + err + "\n"));
        member.removeRole(recruitRole).catch(err => console.log("Error removing recruit role from user: " + applicant.id + " Error was: " + err + "\n"));
        member.setNickname(nick);

        message.channel.send("I have accepted that user.");
        member.send("Congratulations, you are now a full member at " + Config.DISCORD_NAME + "!");

        // Update application status
        await con.query('UPDATE applications SET status = ? WHERE reference = ?', ["Accepted", applicant.id], async function(err, result) {
            if(err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    }
}

module.exports = AcceptApplicationCommand;