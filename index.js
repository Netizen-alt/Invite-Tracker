const {Client, MessageEmbed} = require("discord.js")
const moment = require("moment");
const client = new Client({
    presence: {
        status: "dnd", //dnd //online //idle
        activity: {
            name: "Calculating...", //Project: Audit_Logs Language: JavaScript Premisstion: Administrator , Moderator
            type: "WATCHING", // PLAYING, WATCHING, LISTENING, STREAMING,
            //url: "https://twitch.tv/#"
        }

    }
});

client.config = require('./config/bot');

const guildInvites = new Map;

client.on("inviteCreate",async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("ready",() =>{
    console.log(`${client.user.tag} is online!`)
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
        .then(invites => guildInvites.set(guild.id, invites))
        .cache(err => console.log(err));

    });
});

client.on("guildMemberAdd", async member => {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();

    guildInvites.set(member.guild.id, newInvites);

    try{
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

        const { username, dircriminator } = usedInvite
        const name = `${username}#${dircriminator}`

        const embed = new MessageEmbed()

        .setColor(0xffe4e1)
        .setTitle(`﹕✦・Invitecount `)
        .setDescription(`・・・・・・・・・・・・・・・・・
        ${member}  **joined**〃
        〃**Invited by** ${usedInvite.inviter}・${usedInvite.code}
        ᵎ﹕**Total** ${usedInvite.uses} **Invites**〃
        〃**Accountage** undefined ・
        ・・・・・・・・・・・・・・・・・`)
        //.setDescription(`Hello ${member}, you disk smaill ${member.guild.memberCount}\nJoined useing ${usedInvite.inviter.username}'s\nMember of uses: ${usedInvite.uses}\ninviteLink: ${usedInvite.url}`)
        //.setDescription(`${moment(member.user.createdTimestamp).format('LT')}`)
        //.addField('Time Created', `${moment(member.user.createdAt).fromNow()}`, true)
       //${moment(member.user.createdAt).format('LT')} ${moment(member.user.createdAt).format('LL')} 
        .setTimestamp()

        const joinChannel = member.guild.channels.cache.find(channel => channel.id === "837229172606500925")
        
        if(joinChannel) {
            joinChannel.send(embed).cache(err, console.log(err))
        }
    }
    catch(err) {console.log(err);}
})

client.login(client.config.discord.token);