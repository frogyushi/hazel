const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "punch",
	description: "Punch",
	options: [
		{
			name: "user",
			description: "Select a user",
			type: 6,
			required: true,
		},
	],

	async execute(client, interaction) {
		const member = interaction.options.getUser("user");

		const embed = new MessageEmbed()
			.setColor(client.color)
			.setDescription(`**${interaction.member.user.username}** has punched **${member.username}**`)
			.setImage(
				client.getRandomArrayElement([
					"https://media.giphy.com/media/dLFdh0a92fhxoTgZVf/giphy.gif",
					"https://media.giphy.com/media/vtjMER18uH2bX4VUHq/giphy.gif",
					"https://media.giphy.com/media/xVMLgxUrQR1inwGpem/giphy.gif",
				])
			);

		await interaction.reply({
			content: `<@${interaction.member.id}> <@${member.id}>`,
			embeds: [embed],
		});
	},
};
