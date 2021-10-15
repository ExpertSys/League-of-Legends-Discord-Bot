# League-of-Legends-Discord-Bot
Users can retrieve various player information directly from the League of Legends API using this bot and have it displayed in discord chat.

## Steps

- Retrieve your Discord developer token [the Discord developer portal](https://discord.com/developers/applications)

- Create a bot for Discord and grant it the Server Members privileged intent through the developer portal

- Set up OAuth2 to let the bot connect to your server

- Change the database default password to something random and add your Discord bot token and your emoji Discord IDs to the file

# Basic use
```
# Choosing a channel will allow you to enter the matchmaking queue

# Using the commands below will allow you to perform certain tasks

!addsumm <YOUR SUMMONER NAME> <REGION>`
>>> This will add and lookup your league profile

!cmds`
>>> Give a list of all regions that are supported, and their codes.

!regions`
>>> This will add and lookup your league profile

!summgames`
>>> Get recent games of a summoner

!summinfo <SUMMONER NAME> <REGION> OR !summinfo`
>>> Get the account information of a League of Legends summoner.\nNote: using just '!summinfo' will result in the account you have saved being looked up. Refer to the !addsumm command for adding your account.

!userinfo`
Display your Discord user information.
```

# Configuration
- You can configure the the bot client via botsettings.json file. Just provide your token, user, and password.
