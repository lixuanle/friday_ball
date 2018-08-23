const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const KEYAKI_GREEN = 0xa0d468;

bot.on("ready", function() {
  bot.user.setUsername('MONTA_ELLIS');
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("Monta Ellis Highlights", {type: 'WATCHING'});
});

bot.on("guildMemberAdd", (member) => {
  console.log(member.user)
  member.guild.channels.find("name","general").send("no bullying here ok " + "<@" + member.user.id + "> https://i.imgur.com/sPnCbrS.gifv")
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);
});

bot.login('NDgyMjE5MDYyODU3MDM5ODcz.DmBvfw.5qKJKOEO3qdRxqJPotQDRBlNB3Q');
