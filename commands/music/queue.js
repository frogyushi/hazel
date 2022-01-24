const { MessageEmbed, MessageButton } = require("discord.js");
const paginationEmbed = require("discordjs-button-pagination");

module.exports = {
	name: "queue",
	description: "Provides a queue",

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

		const currentQueue = { queued: [] };
		for (const [id, song] of queue.songs.entries()) {
			if (!id) {
				currentQueue.current = `${song.name} - ${song.formattedDuration}`;
				continue;
			}

			currentQueue.queued.push(`**${id}** - ${song.name} - ${song.formattedDuration}`);
		}

		const queues = [];
		let temporary = "";
		for (i = 0; i < currentQueue.queued.length; i += 10) {
			temporary = currentQueue.queued.slice(i, i + 10);
			queues.push(temporary);
		}

		const embeds = [];
		queues.forEach((chunk) => {
			const embed = new MessageEmbed()
				.setTitle("Now playing")
				.setDescription(currentQueue.current)
				.addFields({
					name: "Next up",
					value: chunk.join("\n\n") || "none",
				})
				.setColor(client.color)
				.setTimestamp();

			embeds.push(embed);
		});

		const previous = new MessageButton().setCustomId("previousbtn").setLabel("<").setStyle("SECONDARY");
		const next = new MessageButton().setCustomId("nextbtn").setLabel(">").setStyle("SECONDARY");

		try {
			paginationEmbed(
				interaction,
				embeds,
				[previous, next],
				120000,
				` • ${queue.songs.length - 1 || "No"} songs in queue • Duration: ${queue.formattedDuration}`
			);
		} catch (err) {}
	},
};
