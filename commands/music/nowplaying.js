const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "nowplaying",
	description: "Provides information on the currently playing song",

	async execute(client, interaction) {
		const queue = client.distube.getQueue(interaction.guildId);

		if (!interaction.member.voice.channel) {
			await interaction.reply({
				content: "This command cannot be used outside of a voice channel",
				ephemeral: true,
			});

			return;
		}

		if (
			!interaction.member.voice.channel.members.has(client.id) &&
			client.voice.adapters.get(interaction.guildId)
		) {
			await interaction.reply({
				content: "This command cannot be used without attending a voice channel with Hazel",
				ephemeral: true,
			});

			return;
		}

		if (!queue) {
			await interaction.reply({
				content: "No queue available to use this command",
				ephemeral: true,
			});

			return;
		}

		const song = queue.songs[0];

		const embed = new MessageEmbed()
			.setTitle(song.name)
			.setFields(
				{
					name: "Channel",
					value: song.uploader.name,
					inline: true,
				},
				{
					name: "Song duration",
					value: `${queue.formattedCurrentTime}/${song.formattedDuration}`,
					inline: true,
				},
				{
					name: "Requested by",
					value: song.user.username,
					inline: true,
				},
				{
					name: "Next up",
					value: queue.songs[1]?.name || "None",
					inline: true,
				}
			)
			.setTimestamp()
			.setColor(client.color.default);

		await interaction.reply({
			embeds: [embed],
		});
	},
};
