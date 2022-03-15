const welcomeMessageSchema = require("../../models/welcomeMessageSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "guildMemberAdd",

	async execute(client, member) {
		const embedConfig = await welcomeMessageSchema.findOne({
			guildId: member.guild.id
		});

		const welcomeRoles = await welcomeRoleSchema.find({
			guildId: member.guild.id
		});

		const channel = await member.guild.channels.cache.get(embedConfig.channelId);

		const embed = new MessageEmbed();

		if (!embedConfig?.isEnabled || !channel) {
			return;
		};

		if (embedConfig.color) {
			embed.setColor(embedConfig.color);
		};

		if (embedConfig.image) {
			embed.setImage(embedConfig.image);
		}

		if (embedConfig.footer) {
			embed.setFooter({ text: embedConfig.footer });
		}

		if (embedConfig.timestamp) {
			embed.setTimestamp();
		}

		if (embedConfig.title) {
			const title = embedConfig.title
				.replace(/{member}/gi, member.user.tag)
				.replace(/{guild}/gi, member.guild.name);

			embed.setTitle(title);
		}

		if (embedConfig.description) {
			const description = embedConfig.description
				.replace(/{member}/gi, `<@${member.user.id}>`)
				.replace(/{guild}/gi, member.guild.name);

			embed.setDescription(description);
		}

		channel.send({
			embeds: [embed]
		});

		const roleIds = welcomeRoles.map(({ roleId }) => roleId);

		member.roles.add(roleIds);
	},
};
