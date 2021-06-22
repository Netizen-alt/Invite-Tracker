const { Client, MessageEmbed } = require("discord.js"); // NPM INSTALL DISCORD.JS V.12
const moment = require('moment'); // NPM INSTALL MOMENT
const client = new Client({ // read docs https://discord.js.org/#/docs/main/stable/class/Presence
    presence: {
        status: "online", 
        activity: {
            name: "code desing by: Looney#0001 | 👻 ",
            type: "LISTENING"
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
        .catch(err => console.log(err));
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

        .setColor('#ffe4e1')
        .setTitle(`﹕✦・Invitecount `)
        .setDescription(`・・・・・・・・・・・・・・・・・
        ${member}  **joined**〃
        〃**Invited by** ${usedInvite.inviter}・${usedInvite.code}
        ᵎ﹕**Total** ${usedInvite.uses} **Invites**〃
        〃**Accountage** ${moment(member.user.createdAt).fromNow()} ・
        ・・・・・・・・・・・・・・・・・`)
        .setTimestamp()

        const ChannelJoin = member.guild.channels.cache.find(channel => channel.id === ""); //ใส่ไอดีห้องที่ต้องการ
        //const ChannelJoin = member.guild.channels.cache.find(channel => channel.name === ""); //ใส่ชื่อห้องที่ต้องการ
        if(ChannelJoin) {
            ChannelJoin.send(embed).catch(err => console.log(err));
        }
    }
    catch(err) {console.log(err);}
});

client.login(client.config.discord.token);

/**
 * @INFO
 * ระบบแจ้งเตือน หรือ เช็คจำนวนการเชิญ ในแบบสมาชิกเข้า
 * Github: https://github.com/JKTheRipperTH
 * Discord: Sansamit_#1449 & Looney#0001
 * อธิบายไม่ค่อยเยอะเท่าไรนะไปศึกษาดูเอาเด้อ
 */
