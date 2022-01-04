const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {
        const channel = member.guild.channels.cache.get("785928459980767293");

        const embed = new MessageEmbed()
            .setColor("#8b81a5")
            .setTitle(`welcome to ${member.guild.name}`)
            .setDescription(`<@${member.user.id}> has entered the server!`)
            .setImage("https://i.imgur.com/ZRqdVlz.png")
            .setFooter("any questions? ask yushi")
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};