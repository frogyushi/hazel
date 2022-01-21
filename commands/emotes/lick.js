const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "lick",
	description: "Lick",
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
			.setDescription(`<@${interaction.member.id}> has licked <@${member.id}>`)
			.setImage(
				client.getRandomArrayElement([
					"https://media.giphy.com/media/ZeLFBjnBz9MTsrmBop/giphy.gif",
					"https://media.giphy.com/media/l4dUubfeVZt6IPpr6o/giphy.gif",
					"https://media.giphy.com/media/J2Zpx29eNS92MwdN2q/giphy.gif",
					"https://media.giphy.com/media/UukSM9g8HDsQ3YEXFT/giphy.gif",
					"https://media.giphy.com/media/S9iGv9qQlCp7FBcnaS/giphy.gif",
					"https://media.giphy.com/media/LS2eLS2JS4hT3enAUl/giphy.gif",
					"https://media.giphy.com/media/kH0viRnUpZBrd67ZUK/giphy.gif",
					"https://media.giphy.com/media/iGos5bfdqi5AdEtdhz/giphy.gif",
					"https://media.giphy.com/media/Qz5s7o5V42jY3ZUsZx/giphy.gif",
					"https://media.giphy.com/media/JtGJki2TmZiqQXBLDQ/giphy.gif",
					"https://media.giphy.com/media/H6cBQfmwqrhDG7nyvV/giphy.gif",
				])
			);

		await interaction.reply({
			content: `<@${member.id}>`,
			embeds: [embed],
		});
	},
};
