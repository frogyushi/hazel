const welcomeMessageSchema = require("../../models/welcomeMessageSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {
        const welcome = await welcomeMessageSchema.findOne({ guildId: member.guild.id });
        if (!welcome?.isEnabled) return;

        const channel = member.guild.channels.cache.get(welcome.channelId);
        if (!channel) return;

        const embed = new MessageEmbed();

        if (welcome.embed.color) embed.setColor(welcome.embed.color);

        if (welcome.embed.title) {
            embed.setTitle((welcome.embed.title.replace(/{member}/gi, member.user.tag)).replace(/{guild}/gi, member.guild.name));
        }

        if (welcome.embed.description) {
            embed.setDescription((welcome.description.replace(/{member}/gi, `<@${member.user.id}>`).replace(/{guild}/gi, member.guild.name)));
        }

        if (welcome.embed.image) embed.setImage(welcome.embed.image);
        if (welcome.embed.footer) embed.setFooter(welcome.embed.footer);
        if (welcome.embed.timestamp) embed.setTimestamp();

        channel.send({ embeds: [embed] });

        const roles = await welcomeRoleSchema.find({ guildId: member.guild.id });
        member.roles.add(roles.map(({ roleId }) => roleId));
    }
};