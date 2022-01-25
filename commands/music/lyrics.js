const geniusapi = require("../../helpers/geniusapi");
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
		const queue = client.distube.getQueue(interaction.guildId);
		const query = interaction.options.getString("query") || queue?.songs[0].name;

		const song = await geniusapi.search(query);

		if (!song?.title) {
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

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
