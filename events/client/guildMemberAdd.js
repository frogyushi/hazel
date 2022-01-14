const welcomeSchema = require("../../models/welcomeSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {
        const schema = await welcomeSchema.findOne({ guildId: member.guild.id });

        if (!schema || !schema.enabled) return;

        const channel = member.guild.channels.cache.get(schema.channelId);

        if (!channel) return;

        function setMentions(string) {
            return (string.replace(/{guild}/gi, member.guild.name)).replace(/{member}/gi, `<@${member.user.id}>`);
        }

        try {
            const embed = new MessageEmbed();

            if (schema.color) embed.setColor(schema.color);
            if (schema.title) embed.setTitle(setMentions(schema.title));
            if (schema.description) embed.setDescription(setMentions(schema.description));
            if (schema.image) embed.setImage(schema.image);
            if (schema.footer) embed.setFooter(schema.footer);
            if (schema.timestamp) embed.setTimestamp();

            channel.send({ embeds: [embed] });
        } catch (e) {
            console.log(e);
        }
    }
};