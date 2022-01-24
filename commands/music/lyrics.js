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

		try {
			const song = (await client.genius.songs.search(query))[0];
			const lyrics = await song.lyrics();

			const embeds = [];
			lyrics.split(/\n\n/g).forEach((lyric) => {
				const embed = new MessageEmbed()
					.setTitle(`Lyrics for ${song.fullTitle}`)
					.setDescription(lyric)
					.setColor(client.color)
					.setTimestamp();

				embeds.push(embed);
			});

			const previous = new MessageButton().setCustomId("previousbtn").setLabel("<").setStyle("SECONDARY");
			const next = new MessageButton().setCustomId("nextbtn").setLabel(">").setStyle("SECONDARY");

			try {
				paginationEmbed(interaction, embeds, [previous, next], 480000);
			} catch (err) {}
		} catch (err) {
			await interaction.reply({
				content: "No results were found for this search",
				ephemeral: true,
			});

			return;
		}
	},
};
