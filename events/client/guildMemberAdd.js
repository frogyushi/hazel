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

		if (welcomeMessage.color) {
			embed.setColor(welcomeMessage.color);
		}

		if (welcomeMessage.title) {
			const title = welcomeMessage.title
				.replace(/{member}/gi, member.user.tag)
				.replace(/{guild}/gi, member.guild.name);

			embed.setTitle({ name: title });
		}

		if (welcomeMessage.description) {
			const description = welcomeMessage.description
				.replace(/{member}/gi, `<@${member.user.id}>`)
				.replace(/{guild}/gi, member.guild.name);

			embed.setDescription(description);
		}

		if (welcomeMessage.image) {
			embed.setImage(welcomeMessage.image);
		}

		if (welcomeMessage.footer) {
			embed.setFooter({ text: welcomeMessage.footer });
		}

		if (welcomeMessage.timestamp) {
			embed.setTimestamp();
		}

		channel.send({ embeds: [embed] });

		member.roles.add(roles.map(({ roleId }) => roleId));
	},
};
