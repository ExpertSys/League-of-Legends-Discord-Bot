const Discord = require('discord.js');
const lolBot = new Discord.Client();
const botSettings = require('./botsettings.json');
const fs = require('fs');

lolBot.commands = new Discord.Collection(); // Collection of bot commands

fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let commandFiles = files.filter(f => f.split(".").pop() === "js");

    if (commandFiles.length <= 0) {
        console.log("No command files found");
    }

    commandFiles.forEach((f, i) => {
        let cmds = require(`./commands/${f}`);
        lolBot.commands.set(cmds.help.name, cmds);
    });
});

lolBot.on("ready", async () => {
    console.log(`Bot is ready!`);
    // Generate bot invite
    // Catch errors if any
    try {
        let link = await lolBot.generateInvite(["ADMINISTRATOR"]);
        //console.log(link);
    } catch (error) {
        console.log(error.stack);
    }
});

lolBot.on("message", async message => {
    if (message.author.bot) return; // Check if message comes from another bot
    if (message.channel.type === "dm") return; // Check if message is through dm

    let userCommand = message.content.split(/[ \t\n]+/, 1)[0].toLocaleLowerCase();
    let userArgs = message.content.substring(userCommand.length).trim().split(/[ \t\n]+/); // removes the command, keeps the args and splits em

    if (!userCommand.startsWith(botSettings.prefix)) return; // Do nothing if the message sent doesn't start with prefix

    let cmdToRun = lolBot.commands.get(userCommand.slice(botSettings.prefix.length)); // Remove the prefix from command

    if (userArgs[0].match(/-help/)) {
        if (cmdToRun) {
            let helpContents = cmdToRun.help;
            let messageToSend = `${botSettings.messageBraces}Command name: ${helpContents.name}\nCommand usage: ${helpContents.usage}\nCommand description: ${helpContents.description}${botSettings.messageBraces}`;
            message.channel.send(messageToSend);
        }
        return;
    };
    userArgs = userArgs.filter(items => {
        return (items !== (undefined || null || ''));
    });

    if (cmdToRun) cmdToRun.run(lolBot, message, userArgs);


});

lolBot.login(botSettings.token);