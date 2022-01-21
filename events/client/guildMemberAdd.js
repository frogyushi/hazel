const welcomeMessageSchema = require("../../models/welcomeMessageSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "guildMemberAdd",

	async execute(client, member) {
		const welcome = await welcomeMessageSchema.findOne({ guildId: member.guild.id });
		const roles = await welcomeRoleSchema.find({ guildId: member.guild.id });
		const channel = member.guild.channels.cache.get(welcome.channelId);
		const embed = new MessageEmbed();

		if (!welcome?.isEnabled || !channel) return;

		if (welcome.color) embed.setColor(welcome.color);
		if (welcome.image) embed.setImage(welcome.image);
		if (welcome.footer) embed.setFooter({ text: welcome.footer });
		if (welcome.timestamp) embed.setTimestamp();

		if (welcome.title) {
			const title = welcome.title.replace(/{member}/gi, member.user.tag).replace(/{guild}/gi, member.guild.name);

			embed.setTitle(title);
		}

		if (welcome.description) {
			const description = welcome.description
				.replace(/{member}/gi, `<@${member.user.id}>`)
				.replace(/{guild}/gi, member.guild.name);

			embed.setDescription(description);
		}

		channel.send({ embeds: [embed] });
		member.roles.add(roles.map(({ roleId }) => roleId));
	},
};
