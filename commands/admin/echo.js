module.exports = {
	name: "echo",
	description: "Echoes a provided message",
	ownerOnly: true,
	options: [
		{
			name: "message",
			description: "Message to be echoed",
			type: 3,
			required: true,
		},
	],

	async execute(client, interaction) {
		const message = interaction.options.getString("message");
		await interaction.deferReply();
		await interaction.deleteReply();
		interaction.channel.send(message);
	},
};
