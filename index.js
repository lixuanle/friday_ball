require('dotenv').config({path: '/home/friday_ball/.env'});
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const botconfig = require("./botconfig.json");
const KEYAKI_GREEN = 0xa0d468;
attendance_list = [];

bot.on("ready", function() {
  bot.user.setUsername('MONTA_ELLIS');
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("Monta Ellis Highlights", {type: 'WATCHING'});
  let member_list = bot.guilds.get('482296816180789268').roles.get('482296955935129601').members.map(m => m.id)
  for(i=0;i<member_list.length;i++) {
    let index = attendance_list.indexOf(member_list[i]);
    if(index === -1) {
      attendance_list.push(member_list[i]);
    }
  }
  updateAttendance();
  // var timer = setInterval(updateAttendance, 3600000);
});

bot.on("error", function() {
  console.error;
  console.log("goodbye");
  bot.destroy();
});

bot.on("guildMemberAdd", (member) => {
  member.guild.channels.find("name","general").send("Please head over to the roles channel on the left hand side and read the information there!!" + "<@" + member.user.id + ">")
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  // message.channel.send("<@" + message.author.id + ">");

  // Adds users to the Members role
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
          attendance_list.push(message.author.id);
          updateAttendance();
        }
      }
    }
  }

  // Event handler to handle Members leaving attendance and to handle tentative members to attend
  if (message.channel.id == "482296860556394496") {
    bot.channels.get('503562334032232468').send({embed: {
      color: KEYAKI_GREEN,
      description: message.author + " said: " + message
    }})
    message.delete();
    if (cmd === prefix + "attending") {
      if (attendance_list.length === 15) {
        message.author.send({embed: {
          color: KEYAKI_GREEN,
          description: "Attendance is maxed out, you can come if you'd like but your playing time might/will be limited."
        }})
      } else {
        let index = attendance_list.indexOf(message.author.id);
        if(index === -1) {
          attendance_list.push(message.author.id);
          updateAttendance();
        }
      }
    } else if (cmd === prefix + "notattending") {
      let index = attendance_list.indexOf(message.author.id);
      if(index !== -1) {
        attendance_list.splice(index, 1);
        updateAttendance();
      }
    } else if (cmd === prefix + "guest") {
      let today = new Date();
      let dd = today.getDay();
      if (dd === 4 || dd === 5) {
        let guest = args;
        guest = guest.join(' ');
        let index = attendance_list.indexOf(guest);
        if (index === -1) {
          attendance_list.push(guest);
          updateAttendance();
        }
      }
      else {
        message.author.send({embed: {
          color: KEYAKI_GREEN,
          description: "Try inviting guests again on a Thursday or Friday."
        }})
      }
    } else if (cmd === prefix + "remove") {
      let guest = args;
      guest = guest.join(' ');
      let index = attendance_list.indexOf(guest);
      if (index !== -1) {
        attendance_list.splice(index, 1);
        updateAttendance();
      }
    }
  }

});

// Updates attendance list(usually once per hour, but will also update when attendance list is updated).
function updateAttendance() {
  bot.channels.get('482296860556394496').bulkDelete(50);
  let embed = new Discord.RichEmbed()
    .setAuthor("Weekly Attendance")
    .setDescription(
      "\n1. " + returnString(attendance_list[0]) + "2. " + returnString(attendance_list[1]) + "3. " + returnString(attendance_list[2]) + "4. " + returnString(attendance_list[3])
       + "5. " + returnString(attendance_list[4]) + "6. " + returnString(attendance_list[5]) + "7. " + returnString(attendance_list[6]) + "8. " + returnString(attendance_list[7])
       + "9. " + returnString(attendance_list[8]) + "10. " + returnString(attendance_list[9]) + "11. " + returnString(attendance_list[10]) + "12. " + returnString(attendance_list[11])
       + "13. " + returnString(attendance_list[12]) + "14. " + returnString(attendance_list[13]) + "15. " + returnString(attendance_list[14])
    )
    .setColor(KEYAKI_GREEN)
    .setFooter("Up to date as of: ")
    .setTimestamp()
  bot.channels.get('482296860556394496').send({embed});
  return bot.channels.get('482296860556394496').send({embed: {
    color: KEYAKI_GREEN,
    description: "**HOW TO USE: ** \n`>attending` to join.\n `>notattending` to remove from list.\n `>guest` to bring a guest. \n `>remove` to remove guest."
  }});
}

// Function to return a proper string or a blank string depending on if a member is available.
function returnString(member) {
  if (member) {
    let reg = /^\d+$/;
    if (reg.test(member)) {
      let nickname = bot.guilds.get('482296816180789268').members.get(member).nickname;
      return ("**" + nickname + "**\n");
    } else {
      return ("**" + member + " - Guest**\n");
    }
  } else {
    return "\n";
  }
}

bot.login(process.env.DISCORD_TOKEN);
