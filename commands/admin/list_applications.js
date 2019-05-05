const Commando = require("discord.js-commando");
const Config = require("../../configs/config.json");
const Admins = Config.ADMINS;
const mysql = require('mysql');
const Moment = require('moment');
const con = mysql.createConnection({
    host: Config.DB.HOST,
    user: Config.DB.USER,
    password: Config.DB.PASSWORD,
    database: Config.DB.DATABASE
});
const table = require('table');

class ListApplicationsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "list_applications",
            group: "admin",
            memberName: "list_applications",
            description: "List all active applications."
        });
    }

    hasPermission(msg) {
        if (!Admins.includes(msg.author.id)) {
            return "Only an admin can use the list_applications command.";
        }
        return true;
    }

    async run(message, args) {

        await this.getApplications(async(err, apps) => {
            if (err !== undefined) {
                console.log(err);
            }

            let config,
                data,
                output,
                counter = 0,
                pages = apps.length / 10;

            console.log("Pages: " + pages);

            data = [
                ['Name', 'Age', 'Applied At'],
            ];

            await apps.forEach((application, i) => {
                if (i <= 10) {
                    data.push([application.name, application.age, Moment(application.created_at).format('DD/MM')]);
                }
            });

            config = {
                border: table.getBorderCharacters(`ramac`)
            };

            output = table.table(data, config);

            message.channel.send("```" + output + "```");

        });
    }

    async getApplications(cb) {
        const res = await con.query("SELECT * FROM applications WHERE status NOT IN ('Accepted', 'Declined')", function(err, result, fields) {
            if (err) {
                message.author.send(`There has been an error listing application. Contact Jxckaroo with the following error:\n\n${err}`);
                return cb(err);
            } else {
                return cb(undefined, result);
            }
        });
    }
}

module.exports = ListApplicationsCommand;