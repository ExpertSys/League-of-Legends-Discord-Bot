const Discord = module.require("discord.js");
const botSettings = require('../botsettings.json');
const dbFunctions = require('../helpers/dbFunctions.js');
const leagueHelpers = require('../helpers/leagueGetters.js');

module.exports.run = async (lolBot, message, userArgs) => {

    // Filter out data that's not related to the summoner we're
    // looking for 
    let getSummonerSpecificData = async (summonerID, dataToFilter) => {
        // Get the rank name
        let summRankName = dataToFilter[0].tier.substr(0, 1) + dataToFilter[0].tier.substring(1).toLowerCase();
        let summLeague = dataToFilter[0].name;

        // Get entries that contain summoner info in the Rank
        let listOfEntries = dataToFilter[0].entries;

        // Remove entries that don't match the ID of the summoner
        let summonerEntry = listOfEntries.filter(entry => {
            return (entry.playerOrTeamId === summonerID.toString());
        });

        // Get rank division(I, II, III, IV, V)
        let summRankDiv = summonerEntry[0].rank;
        // Get amount of LP in division
        let summRankLP = summonerEntry[0].leaguePoints;

        // Get Win/Loss
        let summWins = summonerEntry[0].wins;
        let summLosses = summonerEntry[0].losses;

        let summWinRate = Math.ceil(((summWins / (summWins + summLosses)) * 100));

        // Return the embed after adding summoner's rank info
        return `${summRankName} ${summRankDiv}: ${summLeague}, ${summRankLP}LP\n*- Wins: ${summWins} / Losses: ${summLosses} = ${summWinRate}%*`;
    }

    // Get the rank of the requested summoner
    let getSummonerRank = async (summonerID, embed, summRegion) => {
        // Fetch user's rank data
        let summRankData = await leagueHelpers.getRankData(summonerID, summRegion);

        let userQueues = [];

        // Check if user has Solo Q Data
        if (summRankData.soloQ.length > 0) {
            userQueues.push({ queue: 'Solo Que', rank: await getSummonerSpecificData(summonerID, summRankData.soloQ) });
        }
        else {
            userQueues.push({ queue: 'Solo Que', rank: 'Unranked' });
        }

        // Check if user has Flex 5v5s data
        if (summRankData.flex5s.length > 0) {
            userQueues.push({ queue: 'Flex 5v5', rank: await getSummonerSpecificData(summonerID, summRankData.flex5s) });
        }
        else {
            userQueues.push({ queue: 'Flex 5v5', rank: 'Unranked' });
        }

        // Check if user has Flex 3v3s data
        if (summRankData.flex3s.length > 0) {
            userQueues.push({ queue: 'Flex 3v3', rank: await getSummonerSpecificData(summonerID, summRankData.flex3s) });
        }
        else {
            userQueues.push({ queue: 'Flex 3v3', rank: 'Unranked' });
        }

        let rankedInfo = `User isn't ranked in any queue`;
        let isUserRanked = false;
        userQueues.forEach((value, key) => {
            if (value.rank != "Unranked") {
                if (!isUserRanked) {
                    rankedInfo = "";
                    isUserRanked = true;
                }
                rankedInfo += `**${value.queue}**: ${value.rank}\n`
            };
        })
        // Return embed of user's rank information 
        return embed.addField("Rank", rankedInfo);
    };

    // Get the info of the requested summoner
    let getSummonerInfo = async (summRegion, summName) => {
        // Fetch summoner's account information
        let summInfo = await leagueHelpers.getAccountInfo(summName, summRegion);

        // If data was returned
        if (summInfo) {
            let summonerEmbed = new Discord.RichEmbed();
            // Fill rich embed with returned data
            summonerEmbed.addField("Summoner name", summInfo.name)
                .addField("Level", summInfo.summonerLevel)
                .setColor(message.member.displayHexColor)
                .setThumbnail(`http://avatar.leagueoflegends.com/${summRegion}/${summName}.png`);

            // Call function to get Rank info
            summonerEmbed = await getSummonerRank(summInfo.id, summonerEmbed, summRegion);
            message.channel.send({ embed: summonerEmbed });
            return;
        }
        else {
            message.channel.send(`${botSettings.messageBraces}Summoner '${summName}' was not found!${botSettings.messageBraces}`);
        }

    };
    // TODO something weird happens when you input only '!summinfo hepza'
    // If only enters "!summinfo"
    if (userArgs.length === 0) {
        // Construct user's unique ID
        let userID = `${message.author.username}#${message.author.discriminator}`;

        // Contact DB to get user's summoner infomation
        dbFunctions.getUserInfo(userID).then(result => {
            getSummonerInfo(result[0].summonerRegion.toLocaleLowerCase(), result[0].userSummoner.toLocaleLowerCase());
        }).catch(err => {
            // Appropriate error message if user info wasn't found
            if (!err.includes(undefined)) {
                message.channel.send(`${botSettings.messageBraces}Hmm, I couldn't find your summoner info in my little box, you can add it using the command:\n!addsumm <YOUR SUMMONER NAME> <YOUR REGION>${botSettings.messageBraces}`);
            }
            else {
                console.error(err);
            }
        });

    }
    // If user passes two(name of summoner and region) or more params
    // We have to check if it's greater than two, since we split each word into an array
    // And since some summoner names have more than one word
    else if (userArgs.length >= 2) {
        let summInfo = await leagueHelpers.parseNameAndRegion(userArgs);
        let summonerName = summInfo.summonerName;
        let summonerRegion = summInfo.summonerRegion;
        // A regex used by Riot to see if summoner name is valid
        let isSumNameNotValid = /[0-9\\p{L}_\\.]/.exec(summonerName.toLocaleLowerCase());
        let isRegionValid = await leagueHelpers.findRegionName(summonerRegion.toUpperCase());

        // If entered summoner name and region are valid
        if (!isSumNameNotValid && isRegionValid) getSummonerInfo(isRegionValid, summonerName.toLocaleLowerCase());

        // If the summoner name is invalid, appropriate message to user
        if (isSumNameNotValid) {
            message.channel.send(`${botSettings.messageBraces}Sorry, but '${summonerName}' is an invalid summoner name!${botSettings.messageBraces}`);
        }
        // If the summoner region is invalid, appropriate message to user
        else if (!isRegionValid) {
            message.channel.send(`${botSettings.messageBraces}Sorry, but '${summonerRegion}' is an invalid region code!\nRemember you can use !regions to see codes that are acceptable${botSettings.messageBraces}`);
        }        // Only if the region isn't valid does this output

    }
    // If the user args is less than 2
    else {
        message.channel.send(`${botSettings.messageBraces}That's not how you use that command! Type '${botSettings.prefix}${module.exports.help.name} -help' for more info!${botSettings.messageBraces}`);
    }

    return;
}

module.exports.help = {
    name: `summinfo`,
    usage: `!summinfo <SUMMONER NAME> <REGION> OR !summinfo`,
    description: `Get the account information of a League of Legends summoner.\nNote: using just '!summinfo' will result in the account you have saved being looked up. Refer to the !addsumm command for adding your account.`
}
