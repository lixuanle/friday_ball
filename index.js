const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const botconfig = require("./botconfig.json");
const KEYAKI_GREEN = 0xa0d468;
attendance_list = [];

bot.on("ready", function() {
  bot.user.setUsername('MONTA_ELLIS');
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("Monta Ellis Highlights", {type: 'WATCHING'});
  var timer = setInterval(updateAttendance, 10000);
  let member_list = bot.guilds.get('482296816180789268').roles.get('482296955935129601').members.map(m => m.id)
  for(i=0;i<member_list.length;i++) {
    attendance_list.push(member_list[i]);
  }
});

bot.on("guildMemberAdd", (member) => {
  console.log(member.user)
  member.guild.channels.find("name","general").send("Please head over to the roles channel on the left hand side and read the information there!!" + "<@" + member.user.id + ">")
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  message.channel.send("<@" + message.author.id + ">");


  if (message.channel.id == "482296848120545280") {
    message.delete();
    if (cmd === prefix + "role") {
      if (args[0] === "Member") {
        if (bot.guilds.get('482296816180789268').members.get(message.author.id).roles.get('482296955935129601') === undefined) {
          bot.guilds.get('482296816180789268').members.get(message.author.id).addRole('482296955935129601').then(
            message.channel.send({embed: {
              color: KEYAKI_GREEN,
              description: "Added " + message.author + " to Members role."
          }}));
        }
      }
    }
  }

  if (message.channel.id == "482296860556394496") {
    message.delete();
    if (cmd === prefix + "attending") {
      let index = attendance_list.indexOf(message.author.id);
      if(index === -1) {
        attendance_list.push(message.author.id);
      }
    } else if (cmd === prefix + "notattending") {
      let index = attendance_list.indexOf(message.author.id);
      if(index !== -1) {
        attendance_list.splice(index, 1);
      }
    }
  }

});

async function updateAttendance() {
  // message.channel.bulkDelete(1);
  // let embed = new Discord.RichEmbed()
  //   .setAuthor("Weekly Attendance")
  //   .setDescription()
  //   .setColor(KEYAKI_GREEN)
  //   .setFooter("Updated by the hour.")
  //   .setTimestamp()
  // bot.channels.get('482237205281112074').send({embed});
}

bot.login(process.env.DISCORD_TOKEN);
