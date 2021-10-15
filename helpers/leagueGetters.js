const botSettings = require('../botsettings.json');
const fetch = require('node-fetch');
const acceptableRegions = [
    { name: 'Russia', code: 'RU', acceptable: `'ru'` },
    { name: 'Korea', code: 'KR', acceptable: `'kr'` },
    { name: 'Brazil', code: 'BR1', acceptable: `'br'` },
    { name: 'Oceania', code: 'OC1', acceptable: `'oce'` },
    { name: 'Japan', code: 'JP1', acceptable: `'jp'` },
    { name: 'North America', code: 'NA1', acceptable: `'na'` },
    { name: 'Europe Nordic & East', code: 'EUN1', acceptable: `'eun'` },
    { name: 'Europe West', code: 'EUW1', acceptable: `'euw'` },
    { name: 'Turkey', code: 'TR1', acceptable: `'tr'` },
    { name: 'Latin America North', code: 'LA1', acceptable: `'lan'` },
    { name: 'Latin America South', code: 'LA2', acceptable: `'las'` }
];

// Filter out data to a specific queue type
let getQData = async (rankData, queueToGet) => {
    // Return the filtered array 
    return rankData.filter(entry => {
        return (entry.queue === queueToGet);
    });

}

// Get all rank data for summoner
let getRankData = async (summonerID, summRegion) => {
    // Fetch summoner's data rank
    let summRank = await fetch(`https://${summRegion}.api.riotgames.com/lol/league/v3/leagues/by-summoner/${summonerID}?api_key=${botSettings.APIKEY}`);
    // Parse data into readable json
    let rankData = await summRank.json();
    // Get only Solo Q Rank 
    let soloQ = await getQData(rankData, "RANKED_SOLO_5x5");
    // Get only Flex 5v5s Rank
    let flex5s = await getQData(rankData, "RANKED_FLEX_SR");
    // Get only Flex 3v3s
    let flex3s = await getQData(rankData, "RANKED_FLEX_TT");

    return { soloQ, flex5s, flex3s };

}

// Get summoner account details
let getAccountInfo = async (summName, summRegion) => {
    // Fetch summoner's account details
    let summInfo = await fetch(`https://${summRegion}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summName}?api_key=${botSettings.APIKEY}`);

    // Check if request was successful 
    if (summInfo.statusText === "OK") {
        // Return parsed json data
        return await summInfo.json();
    }
    else {
        return null;
    }
}

// Seperate the username and region from the array, and remove any spaces in the name
let parseNameAndRegion = async userArgs => {
    // Go to end of args and get region
    summonerRegion = userArgs.splice(-1, 1).toLocaleString();
    // Parse summoner name in params and remove spaces if any
    summonerName = userArgs.join().replace(/,/g, "").toLocaleString();

    return { summonerRegion, summonerName };
}

// Check to see if the user's entered region exists in our const variable
let findRegionName = async userRegion => {
    // let otherAcceptableNames = ['OCE', 'LAN', 'LAS', 'EU'];
    // let myRegex = new RegExp(`${userRegion}.*`);
    let found;
    for (let i = 0; i < acceptableRegions.length; i++) {
        if (acceptableRegions[i].acceptable.match(userRegion.toLowerCase())) {
            found = acceptableRegions[i].code.toLowerCase();
            break;
        }
    }
    return found;
}

// Return all acceptable regions
let getAcceptableRegions = async => {
    return acceptableRegions;
}

// Format the output for the '!regions' command
let formatRegionsOutput = async regionsToDisplay => {
    let messageToSend = `${botSettings.messageBraces}The acceptable regions are as followed\n\n`;

    let longestNameString = 0; // Store the length of the region with the lognest name
    let longestAcceptableString = 0; // Store the length of the region with the longest acceptable string

    // Determine the longest name string in acceptableRegions to decide how much space to before the '|'
    // And also the longest acceptable code to decide how much space to put after the '|'
    // This is useful for formatting this output
    for (let i = 0; i < regionsToDisplay.length; i++) {
        if (regionsToDisplay[i].name.length > longestNameString) longestNameString = regionsToDisplay[i].name.length;
        if (regionsToDisplay[i].acceptable.length > longestAcceptableString) longestAcceptableString = regionsToDisplay[i].acceptable.length;
    }

    // Add header 'Regoions' then a number of spaces
    messageToSend += `| Regions`;
    for (let j = 0; j < (longestNameString - 4); j++) {
        messageToSend += " ";
    }
    // Add header 'Codes' then a number of spaces
    messageToSend += `| Codes`;
    for (let i = 0; i < longestAcceptableString - 4; i++) {
        messageToSend += ` `;
    }
    messageToSend += `|\n| `;
    for (let i = 0; i < longestNameString + 2; i++) {
        messageToSend += `-`;
    }

    messageToSend += ` | `;

    for (let i = 0; i < longestAcceptableString; i++) {
        messageToSend += `-`;
    }
    messageToSend += ` |`;
    // Fill the output with the name of the regions and their acceptable codes
    for (let i = 0; i < regionsToDisplay.length; i++) {
        // Enter name first
        messageToSend += `\n| ${regionsToDisplay[i].name}`;
        // Input amount of needed space
        for (let j = 0; j < ((longestNameString - regionsToDisplay[i].name.length) + 3); j++) {
            messageToSend += " ";
        }

        messageToSend += `| ${regionsToDisplay[i].acceptable}`;

        for (let k = 0; k < (longestAcceptableString - regionsToDisplay[i].acceptable.length); k++) {
            messageToSend += " ";
        }

        messageToSend += ` |`;
    }
    messageToSend += `${botSettings.messageBraces}`;
    return messageToSend;
}

module.exports = {
    getRankData,
    getAccountInfo,
    parseNameAndRegion,
    findRegionName,
    getAcceptableRegions,
    formatRegionsOutput
}
