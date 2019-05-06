const Commando = require("discord.js-commando");
const Config = require("../../configs/config.json");
const mysql = require('mysql');
const Moment = require('moment');
const con = mysql.createConnection({
    host: Config.DB.HOST,
    user: Config.DB.USER,
    password: Config.DB.PASSWORD,
    database: Config.DB.DATABASE
});


class ApplicationCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "application",
            aliases: ["app"],
            group: "member",
            memberName: "application",
            description: "Begin the application process for joining the server.",
            args: [{
                    key: "age",
                    prompt: "How old are you?",
                    type: "age",
                    wait: 300
                },
                {
                    key: "q2",
                    prompt: "What is your name?",
                    type: "string",
                    wait: 300
                },
                {
                    key: "q3",
                    prompt: "What is your location?",
                    type: "string",
                    wait: 300
                },
                {
                    key: "q4",
                    prompt: "What game are you here for?",
                    type: "string",
                    wait: 300
                },
                {
                    key: "q5",
                    prompt: "Where did you hear about us?",
                    type: "string",
                    wait: 300
                },
                {
                    key: "q6",
                    prompt: "Have you read the rules of conduct? (y/Y/yes/Yes)",
                    type: "string",
                    wait: 300,
                    error: "You must read the rules of conduct, please try answering again. (y/Y/yes/Yes)",
                    oneOf: [
                        "Yes",
                        "yes",
                        "y",
                        "Y"
                    ]
                }
            ]
        });
    }

    async run(message, args) {
        // Application process
        const applicationState = await this.saveApplication(message, args);

        console.log("Updating/Creating application finished, here is the applicationState: " + console.dir(applicationState));

        // if (applicationState == "created") {
        //     // Discord game reactions
        //     await this.handleReactions(message);
        // }
    }

    async clearChannelHistory(message) {
        const userResponses = message.author.lastMessage.channel.messages;
        await userResponses.forEach(element => {
            element.delete();
        });
    }

    async saveApplication(message, args) {
        let sql = `SELECT * FROM applications WHERE reference = '${message.author.id}'`;
        let applicationState = '';
        let self = this;

        if (message.channel.type === 'dm') {
            await message.reply("You cannot use this command over DM.");
        } else {
            con.query(sql, function(err, result) {
                if (err) {
                    message.author.send(`There has been an error with your application. Contact Jxckaroo with the following error:\n\n${err}`);
                    return;
                } else {
                    if (result.length > 0) {
                        applicationState = self.updateApplication(result, message, args);
                    } else {
                        applicationState = self.createApplication(message, args);
                    }
                }
            });

            // Clear up channel history
            await this.clearChannelHistory(message);

            return applicationState;
        }
    }

    async createApplication(message, args) {
        // Create new application
        const applicationDate = Moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        let response = await con.query('INSERT INTO applications (name, age, location, game, current, conduct, reference, created_at, status) VALUES (?,?,?,?,?,?,?,?, "Applied (Discord)")', [args["q2"], args["age"], args["q3"], args["q4"], args["q5"], args["q6"], message.author.id, applicationDate], async function (err, result) {
            if (err) {
                message.author.send(`There has been an error with your application. Contact Jxckaroo with the following error message:\n\n${err}`);
                return 'error';
            } else {
                const role = message.guild.roles.find("name", "Recruit");
                await message.member.addRole(role);
                await message.reply("\n\nYour application has been submitted and you are now a recruit.\n\n Your reference is: **" + message.author.id + "**.\n\n One of the admin team will get back to you shortly, good luck!");
                return 'created';
            }
        });

        return response;
    }

    async updateApplication(result, message, args) {
        // Update existing application
        let response = await result.forEach(async(element, i) => {
            if (element.reference == message.author.id) {
                await con.query('UPDATE applications SET name = ?, age = ?, location = ?, game = ?, current = ?, conduct = ?, status = "Applied (Discord)" WHERE reference = ?', [args["q2"], args["age"], args["q3"], args["q4"], args["q5"], args["q6"], element.reference], async function(err, result) {
                    if (err) {
                        message.author.send(`There has been an error updating your application. Contact Jxckaroo with the following error message:\n\n${err}`);
                        return 'error';
                    } else {
                        const role = message.guild.roles.find("name", "Recruit");
                        await message.member.addRole(role);
                        message.reply("\n\nWe have updated your application! Check with an admin to see how you are getting on.\n\n Your application reference is:\n\n **" + message.author.id + "** \n\n :smiley:");
                        return 'updated';
                    }
                });
                return;
            }
        });

        return response;
    }

    // async handleReactions(message) {
    //     const gameMessage = await message.channel.send("React to the roles below to assign them to yourself.\n\n***Please note: The Bot will assign you a role on reaction. The Bot should send you a DM to confirm.***\n\n`if your having an issue reacting please don't use a mobile device.`");
    //     await this.defaultReactions(gameMessage);
    //     await this.awaitReactions(gameMessage, message);
    // }
    //
    // async awaitReactions(gameMessage, message) {
    //     const filter = (reaction, user) => reaction.count > 1;
    //
    //     let collector = gameMessage.createReactionCollector(filter, {
    //         time: 300000
    //     });
    //     collector.on('collect', async(reaction, collector) => {
    //         await this.handleReaction(reaction, message);
    //     });
    //     collector.on('end', collected => {
    //         // Clear up channel history
    //         this.clearChannelHistory(message);
    //         console.log(`collected ${collected.size} reactions`);
    //     });
    // }
    //
    // async handleReaction(reaction, message) {
    //     const emojis = Config.REACTS;
    //     for (var k in emojis) {
    //         if (emojis.hasOwnProperty(k)) {
    //             if (reaction.emoji.id == emojis[k]) {
    //                 await this.applyRole(k, message);
    //             }
    //         }
    //     }
    // }
    //
    // async applyRole(role, message) {
    //     const newRole = message.guild.roles.find("name", role);
    //     await message.member.addRole(newRole);
    // }
    //
    // async defaultReactions(message) {
    //     const emojis = Config.REACTS;
    //     for (var k in emojis) {
    //         if (emojis.hasOwnProperty(k)) {
    //             console.log("Key is " + k + ", value is " + emojis[k]);
    //             await message.react(message.guild.emojis.get(emojis[k]));
    //         }
    //     }
    // }
}

module.exports = ApplicationCommand;