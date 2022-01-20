const joinToCreateSchema = require("../../models/joinToCreateSchema");

module.exports = {
	name: "voiceStateUpdate",

	async execute(client, oldState, newState) {
		const schema = await joinToCreateSchema.findOne({
			guildId: oldState.guild.id || newState.guild.id,
		});

		if (!schema?.isEnabled) return;

		if (newState?.channelId === schema?.channelId) {
			const { guild, user, voice, id } = newState.member;
			const parent = newState.channel?.parentId;
			const parentId = parent ? { parent } : {};

			const vc = await guild.channels.create(`${user.username}'s channel`, {
				type: "GUILD_VOICE",
				...parentId,
				permissionOverwrites: [
					{
						id: id,
						allow: ["MANAGE_CHANNELS"],
					},
				],
			});

			client.temp.set(vc.id, newState.member);
			voice.setChannel(vc.id);
		}

		if (client.temp.get(oldState.channelId) && !oldState.channel.members.size) {
			oldState.channel.delete();

			return;
		}
	},
};
