const Discord = module.require("discord.js");
const botSettings = require('../botsettings.json');
const leagueHelpers = require('../helpers/leagueGetters.js');
const fs = require('fs');

module.exports.run = async (lolBot, message, userArgs) => {
    // User has to enter just the command
    if (userArgs.length == 0) {
        let messageToSend = `${botSettings.messageBraces}Here's what I know!\n`;
        let longestKeyLength = 0; // Hold length of longest command name

        // Find out length of longest command
        lolBot.commands.forEach((value, key) => {
            if (key.length > longestKeyLength) longestKeyLength = key.length;
        })

        // Fill in the messageToSend variable with '<command name> - <command usage>'
        lolBot.commands.forEach((value, key) => {
            messageToSend += `| ${key}`;

            // Add spaces for formatting. The space is based on the longest string
            // minus the length of the current, to have an even length
            for (let i = 0; i < (longestKeyLength - key.length) + 2; i++) {
                messageToSend += " ";
            }
            messageToSend += `-  ${value.help.usage}\n`;

        });
        messageToSend += `You can type in a command along with the text '-help' to get more info on it\nFor example: '${botSettings.prefix}${module.exports.help.name} -help'${botSettings.messageBraces}`;
        message.channel.send(messageToSend);

        return;
    }
    // If userArgs isn't empty
    else {
        message.channel.send(`${botSettings.messageBraces}That's not how you use that command! Type '${botSettings.prefix}${module.exports.help.name} -help' for more info!${botSettings.messageBraces}`);
    }


}

module.exports.help = {
    name: `cmds`,
    usage: `!cmds`,
    description: `List out all available commands.`
}