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
            aliases: ["l"],
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
        await this.init(message);
    }

    async init(message, lastId = 0, nextId = 0) {
        await this.getTenApplications(nextId, lastId, message, async(err, apps) => {
            nextId = apps[apps.length-1].id;

            if (err !== undefined) {
                console.log(err);
            }

            let config,
                data,
                output;

            data = [
                ['ID', 'Name', 'Age', 'Applied At'],
            ];

            // Get the first 10 apps to display
            await apps.forEach((application, i) => {
                message.guild.members.forEach((element) => {
                    if(i !== 10 && element.user.id == application.reference) {
                        data.push([application.id, element.user.username || application.name, application.age, Moment(application.created_at).format('DD/MM')]);
                    }
                });
            });

            config = {
                border: table.getBorderCharacters(`ramac`)
            };

            output = table.table(data, config);

            message.channel.send("```" + output + "```");
        });
    }

    async getTenApplications(nextId, lastId, message, cb) {
        let query = '',
            params = '';

        if(lastId == 0 && nextId == 0) {
            query = "SELECT * FROM applications WHERE status NOT IN ('Accepted', 'Declined') LIMIT 11";
            params = '';
        } else {
            query = "SELECT * FROM applications WHERE status NOT IN ('Accepted', 'Declined') AND id > ? LIMIT 11";
            params = nextId;
        }

        const res = await con.query(query, [params], function(err, result, fields) {
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