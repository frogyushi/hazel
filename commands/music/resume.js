module.exports = {
	name: "resume",
	description: "resumes a paused queue",

	async execute(client, interaction) {
		const queue = client.distube.getQueue(interaction.guildId);

		if (!interaction.member.voice.channel) {
			await interaction.reply({
				content: "this command can only be used inside a voice channel",
				ephemeral: true,
			});

			return;
		}

		if (
			!interaction.member.voice.channel.members.has(client.id) &&
			client.voice.adapters.get(interaction.guildId)
		) {
			await interaction.reply({
				content: "u cannot use this command if you're not in the same voice channel as hazel",
				ephemeral: true,
			});

			return;
		}

		if (!queue) {
			await interaction.reply("no queue available to use this command");

			return;
		}

		if (!queue.paused) {
			await interaction.reply("queue is not paused");

			return;
		}

		queue.resume();

		await interaction.reply("queue has been resumed");
	},
};
