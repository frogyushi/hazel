const joinToCreateSchema = require("../../models/joinToCreateSchema");

module.exports = {
	name: "voiceStateUpdate",

	async execute(client, oldState, newState) {
		const jtcConfig = await joinToCreateSchema.findOne({
			guildId: oldState.guild.id || newState.guild.id,
		});

		if (!jtcConfig?.isEnabled) {
			return;
		};

		if (newState?.channelId === jtcConfig?.channelId) {
			const { guild, user, voice, id } = newState.member;

			const jtcName = `${user.username}'s channel`;

			const jtcSettings = {
				type: "GUILD_VOICE",
				parent: newState.channel?.parentId || null,
				permissionOverwrites: [
					{
						id: id,
						allow: ["MANAGE_CHANNELS"],
					},
				],
			};

			const jtcChannel = await guild.channels.create(jtcName, jtcSettings);

			client.temp.set(jtcChannel.id, newState.member);
			voice.setChannel(jtcChannel.id);
		}

		if (client.temp.get(oldState.channelId) && !oldState.channel.members.size) {
			oldState.channel.delete();

			return;
		}
	},
};
