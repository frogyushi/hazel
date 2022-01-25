const { MessageEmbed, MessageButton } = require("discord.js");
const paginationEmbed = require("discordjs-button-pagination");

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
		const queue = client.distube.getQueue(interaction.guildId);
		const query = interaction.options.getString("query") || queue.songs[0].name;

		let lyrics = null;

		try {
			const [song] = await client.genius.songs.search(query);
			lyrics = await song.lyrics();
		} catch (err) {
			await interaction.reply({
				content: "No results were found for this search",
				ephemeral: true,
			});

			return;
		}

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
