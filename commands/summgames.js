const Discord = module.require("discord.js");
const botSettings = require('../botsettings.json');
const leagueHelpers = require('../helpers/leagueGetters.js');
const tinyURL = require('tinyurl');

module.exports.run = async (lolBot, message, userArgs) => {
    /*TODO
    - Get ranked games and regular matches /maybe 20 or less
    - Get runes for summoner /maybe most recent runes
    - Might have to use something other than a richEmbed for ranked Games, cause pictures
    - The more match details url: Get the ""gameId": 2652010600," and past it into this link: 
    https://matchhistory.na.leagueoflegends.com/en/#match-details/NA1/${gameID}/${userAccountID}?tab=overview
    And it will give you the match history of that match for anybody
*/
    let gameLink = ``;
    tinyURL.shorten(`https://matchhistory.na.leagueoflegends.com/en/#match-details/NA1/2673987929/44375222?tab=overview`, async res => {
        message.channel.send(`${botSettings.messageBraces}${res}${botSettings.messageBraces}`);
    });
    

}

module.exports.help = {
    name: `summgames`,
    usage: `!summgames`,
    description: `Get recent games of a summoner`
}