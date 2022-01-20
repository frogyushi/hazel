const welcomeMessageSchema = require("../../models/welcomeMessageSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "guildMemberAdd",

	async execute(client, member) {
		const welcomeMessage = await welcomeMessageSchema.findOne({
			guildId: member.guild.id,
		});

		const channel = member.guild.channels.cache.get(welcomeMessage.channelId);

		const embed = new MessageEmbed();

		const roles = await welcomeRoleSchema.find({
			guildId: member.guild.id,
		});

		if (!welcomeMessage?.isEnabled || !channel) return;

		if (welcomeMessage.embed.color) {
			embed.setColor(welcomeMessage.embed.color);
		}

		if (welcomeMessage.embed.title) {
			const title = welcomeMessage.embed.title
				.replace(/{member}/gi, member.user.tag)
				.replace(/{guild}/gi, member.guild.name);

			embed.setTitle(title);
		}

		if (welcomeMessage.embed.description) {
			const description = welcomeMessage.embed.description
				.replace(/{member}/gi, `<@${member.user.id}>`)
				.replace(/{guild}/gi, member.guild.name);

			embed.setDescription(description);
		}

		if (welcomeMessage.embed.image) {
			embed.setImage(welcomeMessage.embed.image);
		}

		if (welcomeMessage.embed.footer) {
			embed.setFooter(welcomeMessage.embed.footer);
		}

		if (welcomeMessage.embed.timestamp) {
			embed.setTimestamp();
		}

		channel.send({ embeds: [embed] });

		member.roles.add(roles.map(({ roleId }) => roleId));
	},
};
