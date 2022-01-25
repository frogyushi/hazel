const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	description: "Provides a queue",
	options: [
		{
			name: "page",
			description: "Provide an optional page to expand queue",
			type: 10,
		},
	],

	async execute(client, interaction) {
		const queue = client.distube.getQueue(interaction.guildId);
		const page = Math.floor(interaction.options.getNumber("page")) || 0;

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

		const currentQueue = { queued: [] };
		for (const [id, song] of queue.songs.entries()) {
			if (!id) {
				currentQueue.current = `${song.name} - ${song.formattedDuration}`;
				continue;
			}

			currentQueue.queued.push(`**${id}** - ${song.name} - ${song.formattedDuration}`);
		}

		const maxSongs = Math.ceil(currentQueue.queued.length / 10);
		const pageDisplay = page === 1 || page ? page * 10 - 10 : 0;

		const embed = new MessageEmbed()
			.setTitle("Now playing")
			.setDescription(currentQueue.current)
			.addFields({
				name: "Next up",
				value: currentQueue.queued.slice(0 + pageDisplay, 10 + pageDisplay).join("\n\n") || "none",
			})
			.setColor(client.color)
			.setFooter({
				text: `Page ${page || 1} of ${maxSongs || 1} • ${queue.songs.length - 1 || "No"} songs in queue • ${
					queue.formattedDuration
				}`,
			})
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});
	},
};
