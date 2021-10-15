const Discord = module.require("discord.js");
const dateFormat = module.require('dateformat');
module.exports.run = async (lolBot, message, userArgs) => {
    // User has to enter just the command
    if (userArgs.length == 0) {

        let createdDate = new Date(message.author.createdAt);

        // Create and fill RichEmbed with user's info
        let embed = new Discord.RichEmbed()
            .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
            .addField("ID", message.author.id)
            .addField("Created At", dateFormat(createdDate, "dddd, mmmm dS, yyyy, h:MM TT Z"))
            .setThumbnail(message.author.avatarURL)
            .setColor(message.member.displayHexColor);

        message.channel.send({ embed: embed });

        return;
    }
    // If userArgs isn't empty
    else {
        message.channel.send(`${botSettings.messageBraces}That's not how you use that command! Type '${botSettings.prefix}${module.exports.help.name} -help' for more info!${botSettings.messageBraces}`);
    }

}

module.exports.help = {
    name: `userinfo`,
    usage: `!userinfo`,
    description: `Display your Discord user information.`
}