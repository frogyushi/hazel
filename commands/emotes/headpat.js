const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "headpat",
	description: "Headpat",
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
			.setDescription(`<@${interaction.member.id}> gave <@${member.id}> a headpat`)
			.setImage(
				client.getRandomArrayElement([
					"https://media.giphy.com/media/109ltuoSQT212w/giphy.gif",
					"https://media.giphy.com/media/ye7OTQgwmVuVy/giphy.gif",
					"https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.gif",
					"https://media.giphy.com/media/SWjOyVOcUECfdG7dQm/giphy.gif",
					"https://media.giphy.com/media/S6NIIbtNYOTtvgdwWC/giphy.gif",
					"https://media.giphy.com/media/QWRln9pNiBmJt1Krks/giphy.gif",
					"https://media.giphy.com/media/S5uT7KROKtGCON9w4c/giphy.gif",
					"https://media.giphy.com/media/S98oiYhUk7pa6RjC7C/giphy.gif",
					"https://media.giphy.com/media/eMtJldMsmIbQkcewyx/giphy.gif",
					"https://media.giphy.com/media/l1rejhOyfxSdzOgIfx/giphy.gif",
				])
			);

		await interaction.reply({
			content: `<@${member.id}>`,
			embeds: [embed],
		});
	},
};
