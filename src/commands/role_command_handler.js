const Config            = require('../../data/config.json');
const CommandHandler    = require('./command_handler');
const Discord           = require('discord.js');

module.exports = class RoleEventHandler extends CommandHandler {
    constructor() {
        super('role');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "list", 
            "Gets a list of roles that can be modified by the user",
            "list",
            listRoles
        );
        super.addCommand(
            "count", 
            "Counts how many people have a certain role",
            'count Admins',
            countRole
        );
        super.addCommand(
            "add",
            "Add 1 or more roles to yourself",
            "add C++ Java Linux",
            addRoles
        )
        super.addCommand(
            "remove",
            "Remove 1 or more roles from yourself",
            "remove C++ Java Linux",
            removeRoles
        )
    }
}


function listRoles(message, args, client) {
    const roleArray = Config.modifiableRoles;
    let output = new Discord.RichEmbed()
        .setTitle("Modifiable Roles From >role add/remove Commands");

    let i = 0;
    for (var roleName of roleArray) {
        output.addField(`Role ${++i}`,  `${roleName}\n`, true);
        if (i == 25) {
            break;
        }
    }
    message.channel.send(output);
}

function countRole(message, args, client) {
    if (args.length < 1) {
        return;
    }
    let role = message.guild.roles.find((role) => {
        return role.name.toLowerCase() === args[0];
    });

    if (role === null) {
        var output = `Role '${args[0]} does not exist.`;
    }
    else {
        var output = `Number of users with role "**${args[0].toUpperCase()}**": ${role.members.size}`;
    }
    message.channel.send(output);
}

function addRoles(message, args, client) {
    modifyRoles(message, args, "add");
}

function removeRoles(message, args, client) {
    modifyRoles(message, args, "remove");
}

function modifyRoles(message, args, action)
{
    let rolesToModify   = extractRoles(message.guild, args);
    let member          = message.member;

    //Add/ Remove the roles
    if (action === "add") {
        for (role of rolesToModify) {
            member.addRole(role)
            .then (console.log("Role add successful"));
        }
        var verb = "added";
        var dir  = "to";
    }
    else if (action === "remove") {
        for (role of rolesToModify) {
            member.removeRole(role)
                .then (console.log("Role remove successful"));
        }
        var verb = "removed";
        var dir  = "from";
    }
    //Send result
    let output = createOutput(args, message.author.id.toString(), verb, dir);
    message.channel.send(output);
}

function createOutput(languages, userID, verb, dir)
{
    let sp = languages.length == 1 ?  "role" :  "roles";
    return `I have **${verb}** the following ${sp} ${dir} **<@${userID}>**:\n> ${languages.join("\n>")}`;
}

function extractRoles(guild, languageList)
{
    let rolesToMod = [];
    for (lang of languageList) {
        role = guild.roles.find((langName) => {
            return langName.name.toLowerCase() === lang;
        });
        rolesToMod.push(role);
    }
    return rolesToMod;
}