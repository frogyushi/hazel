const Genius = require("genius-lyrics");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "lyrics",
	description: "Provides lyrics using given query, else use current playing song",
	guildOnly: true,
	options: [
		{
			name: "query",
			description: "Provide a search query",
			type: 3,
		},
	],

	async execute(client, interaction) {
		const genius = new Genius.Client();
		const queue = client.distube.getQueue(interaction.guildId);
		const query = interaction.options.getString("query") || queue?.songs[0].name;

		let song = null;
		try {
			[song] = await genius.songs.search(query);
		} catch (err) {}

		if (!song) {
			await interaction.reply({
				content: "No results were found for this search",
				ephemeral: true,
			});

			return;
		}

		const lyrics = await song.lyrics();
		const embed = new MessageEmbed()
			.setTitle(`Lyrics for ${song.fullTitle}`)
			.setDescription(lyrics)
			.setColor(client.color)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});
	},
};
