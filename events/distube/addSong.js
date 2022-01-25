const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addSong",

	async execute(client, queue, song) {
		const embed = new MessageEmbed()
			.setAuthor({ name: "Added to queue" })
			.setTitle(song.name)
			.setFields(
				{
					name: "Channel",
					value: song.uploader.name,
					inline: true,
				},
				{
					name: "Song duration",
					value: song.formattedDuration,
					inline: true,
				},
				{
					name: "Estimate time of playing",
					value: queue.formattedCurrentTime,
					inline: true,
				},
				{
					name: "Position in queue",
					value: (queue.songs.length - 1 || "None").toString(),
					inline: true,
				}
			)
			.setTimestamp()
			.setColor(client.color);

		queue.textChannel.send({
			embeds: [embed],
		});
	},
};
