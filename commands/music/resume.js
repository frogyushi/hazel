module.exports = {
	name: "resume",
	description: "Resume a paused queue",

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

		if (!queue.paused) {
			await interaction.reply("Queue is not paused");

			return;
		}

		queue.resume();

		await interaction.reply("Queue has been resumed");
	},
};
