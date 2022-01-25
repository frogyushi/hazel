const { getSong } = require("genius-lyrics-api");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "lyrics",
	description: "Provides lyrics using given query, else use current playing song",
	options: [
		{
			name: "query",
			description: "Provide a search query",
			type: 3,
		},
	],

	async execute(client, interaction) {
		const queue = client.distube.getQueue(interaction.guildId);

		const song = await getSong({
			apiKey: "tLZ9rcX6AEV7zXakeywW7D0lIrFO3ARYnfO_Yyw6daM72AGL80QYeeZO5xwb8rdQ",
			title: interaction.options.getString("query") || queue?.songs[0].name,
			artist: "",
			optimizeQuery: true,
		});

		if (!song) {
			await interaction.reply({
				content: "No results were found for this search",
				ephemeral: true,
			});

			return;
		}

		const embed = new MessageEmbed()
			.setTitle(`Lyrics for ${song.title}`)
			.setDescription(song.lyrics)
			.setColor(client.color)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});
	},
};
