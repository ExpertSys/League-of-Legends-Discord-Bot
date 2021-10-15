const Discord = module.require("discord.js");
const botSettings = require('../botsettings.json');
const dbFunctions = require('../helpers/dbFunctions.js');
const leagueHelpers = require('../helpers/leagueGetters.js');

module.exports.run = async (lolBot, message, userArgs) => {
    // message.channel.send(`${botSettings.messageBraces}Dad's working on this function, it'll be up soon${botSettings.messageBraces}`);

    if (userArgs.length >= 2) {
        let parsedNameAndRegion = await leagueHelpers.parseNameAndRegion(userArgs); // Read the summonerName and the summonerRegion
        let summonerName = parsedNameAndRegion.summonerName;
        let summonerRegion = parsedNameAndRegion.summonerRegion;
        // We'll use this ID to associate it with account
        let userID = `${message.author.username}#${message.author.discriminator}`;

        // Check if the user provided region is acceptable
        let validSumRegion = await leagueHelpers.findRegionName(summonerRegion.toUpperCase());
        // A regex used by Riot to see if summoner name is valid
        let isSumNameNotValid = /[0-9\\p{L}_\\.]/.exec(summonerName);

        // Insert the user's summonerinfo if the name and region check out
        if (!isSumNameNotValid && validSumRegion) {
            dbFunctions.insertUserSummonerInfo(userID, summonerName, validSumRegion).then(() => {
                message.channel.send(`${botSettings.messageBraces}I've successfully added your account to my little box! Remember, you can use the same command to update your account info.${botSettings.messageBraces}`);
            }).catch(err => {
                if (err) console.error(err);
            });
        }
        // If the summoner name is invalid, appropriate message to user
        else if (isSumNameNotValid) {
            message.channel.send(`${botSettings.messageBraces}I can't add that, '${summonerName}' is an invalid summoner name!${botSettings.messageBraces}`);
        }
        // If the summoner region is invalid, appropriate message to user        
        else if (!validSumRegion) {
            message.channel.send(`${botSettings.messageBraces}I can't add that, '${summonerRegion}' is an invalid region!\nRemember you can use !regions to see codes are acceptable${botSettings.messageBraces}`);
        }

    }
    // If the amount of args is less than 2
    else {
        message.channel.send(`${botSettings.messageBraces}That's not how you use that command! Type '${botSettings.prefix}${module.exports.help.name} -help' for more info!${botSettings.messageBraces}`);
    }

    return;
}

module.exports.help = {
    name: `addsumm`,
    usage: `!addsumm <YOUR SUMMONER NAME> <REGION>`,
    description: `Add your summoner info to my little box, that way all you need is !summinfo and I can easily look you up!`
}
