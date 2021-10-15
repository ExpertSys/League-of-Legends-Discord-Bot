const Discord = module.require("discord.js");
const botSettings = require('../botsettings.json');
const leagueHelpers = require('../helpers/leagueGetters.js');

module.exports.run = async (lolBot, message, userArgs) => {
    // User has to enter just the command
    if (userArgs.length == 0) {
        let regionsToDisplay = await leagueHelpers.getAcceptableRegions(); // Return a list of supported regions
        let regionOutput = await leagueHelpers.formatRegionsOutput(regionsToDisplay); // Return have the regions formatted and returned
        return message.channel.send(regionOutput);
    }
    // If userArgs isn't empty
    else {
        message.channel.send(`${botSettings.messageBraces}That's not how you use that command! Type '${botSettings.prefix}${module.exports.help.name} -help' for more info!${botSettings.messageBraces}`);
    }
}

module.exports.help = {
    name: `regions`,
    usage: `!regions`,
    description: `Give a list of all regions that are supported, and their codes.`
}