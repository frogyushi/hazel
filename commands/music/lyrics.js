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
		const query = interaction.options.getString("query") || queue?.songs[0].name;

		const options = {
			title: query,
			artist: "",
			apiKey: "tLZ9rcX6AEV7zXakeywW7D0lIrFO3ARYnfO_Yyw6daM72AGL80QYeeZO5xwb8rdQ",
			optimizeQuery: true,
		};

		const song = await getSong(options);

		if (!song) {
			await interaction.reply({
				content: "No results were found for this search",
				ephemeral: true,
			});

			return;
		}

		const embed = new MessageEmbed()
			.setTitle(`Lyrics for ${song.title}`)
			.setFields(
				...song.lyrics.split(/\/n\/n/).map((chunk) => ({
					name: "\u200b",
					value: chunk,
				}))
			)
			.setColor(client.color)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});
	},
};
