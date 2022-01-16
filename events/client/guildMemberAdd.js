const welcomeSchema = require("../../models/welcomeSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {
        const schema = await welcomeSchema.findOne({ guildId: member.guild.id });

        if (!schema?.enabled) return;

        const channel = member.guild.channels.cache.get(schema.channelId);

        if (!channel) return;

        const embed = new MessageEmbed();

        if (schema.color) embed.setColor(schema.color);

        if (schema.title) {
            embed.setTitle((schema.title.replace(/{member}/gi, member.user.tag)).replace(/{guild}/gi, member.guild.name));
        }

        if (schema.description) {
            embed.setDescription((schema.description.replace(/{member}/gi, `<@${member.user.id}>`).replace(/{guild}/gi, member.guild.name)));
        }

        if (schema.image) embed.setImage(schema.image);
        if (schema.footer) embed.setFooter(schema.footer);
        if (schema.timestamp) embed.setTimestamp();

        channel.send({ embeds: [embed] });

        const roles = await welcomeRoleSchema.find({ guildId: member.guild.id });
        member.roles.add(roles.map(({ role }) => role));
    }
};