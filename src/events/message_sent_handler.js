const PollCommandHandler    = require('../commands/poll_command_handler')
const RoleCommandHandler    = require('../commands/role_command_handler')
/**
 * Class to handle messages sent by the user
 */
module.exports = class MessageSentHandler {
    /**
     * Creates the command handlers and constructs the handler
     */
    constructor () {
        this.commandHandlers = [
            new PollCommandHandler(),
            new RoleCommandHandler()
        ]
    }
    /**
     * Entry point for handling messages
     * @param {Discord.TextMessage} message The raw message sent by a user
     * @param {Discord client} client The Discord client the message was sent 
     */
    handleMessageSent(message, client) {
        logMessageInfo(message);
        if ((message.channel.type !== "text") || 
            (message.author.bot)) {
            return;
        }
        if (message.content.startsWith('>')) {
            this.handleCommand(message, client);
        }
    }

    /**
     * Handles a command message
     * @param {MessageInfo} msgInfo Info about message sent by user
     */
    handleCommand(message, client) {
        const content = message.content
                            .slice(1)   //Remove the '>' if it is there
                            .split(' ')
                            .map((s) => {
                                return s.toLowerCase()
                            });
        const commandCategory = content[0];
        let args              = content.slice(1);

        for (let handler of this.commandHandlers) {
            if (handler.isCommand(commandCategory)) {
                handler.handleCommand(message, args, client);
            }
        }
    }
}

function logMessageInfo(message) {
    const ch = message.channel.name;
    const user = message.member.displayName;
    const msg = message.content;

    console.log("============")
    console.log(`Message Sent\nChannel: ${ch}\nUser: ${user}\nContent: ${msg}\n`);
    console.log("============\n")
}

/*
        if (message.channel.type !== "text") return;

        //Print some message information, which can help with tracking down bugs
        console.log(`Message Sent\nServer: ${message.guild.name}\nChannel: ${message.channel.name}\nUser: ${message.member.displayName}\nContent: ${message}\n`);

        let content = message.content;
        //Ignore messages sent by bots
        if (message.author.bot) {
            return;
        }

        if (message.channel.name === Config.newMemberChannel) {
            let newMemberRole = message.member.guild.roles.find('name', Config.newMemberRole);
            let introduceRole = message.member.guild.roles.find('name', Config.introRole);
            message.member.removeRole(newMemberRole);
            message.member.addRole(introduceRole);
        }

        //A message starting with > indicates it is a command 
        if (content.startsWith(">")) {
            this.commandHandler.handleCommand(message);
        }

        //If a quiz is currently active, then it may be someone trying to answer it
        if (this.quiz.quizActive) {
            console.log(content);
            this.quiz.submitAnswer(message, content.toLowerCase());
        }
*/