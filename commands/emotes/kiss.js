const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "kiss",
    description: "Kiss",
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

        const image = client.getRandomArrayElement([
            "https://media.giphy.com/media/QGc8RgRvMonFm/giphy.gif",
            "https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif",
            "https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif",
            "https://media.giphy.com/media/zkppEMFvRX5FC/giphy.gif",
            "https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif",
            "https://media.giphy.com/media/11rWoZNpAKw8w/giphy.gif",
            "https://media.giphy.com/media/w62BhkdkxaCwE/giphy.gif",
            "https://media.giphy.com/media/hogpNuO4rveGca2wkZ/giphy.gif",
            "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
            "https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif",
            "https://media.giphy.com/media/Quhl2AS7lC7MoHrSYk/giphy.gif",
        ]);

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(
                `**${interaction.member.user.username}** has kissed **${member.username}**`
            )
            .setImage(image);

        await interaction.reply({
            content: `<@${interaction.member.id}> <@${member.id}>`,
            embeds: [embed],
        });
    },
};
