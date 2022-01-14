const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "punch",
    description: "punch someone",
    options: [
        {
            name: "user",
            description: "select a user",
            type: 6,
            required: true
        }
    ],

    async execute(client, interaction) {
        const member = interaction.options.getUser("user");

        const embed = new MessageEmbed()
            .setColor("#8b81a5")
            .setDescription(`<@${interaction.member.id}> has punched <@${member.id}>`)
            .setImage(
                client.getRandomArrayElement(
                    [
                        "https://media.giphy.com/media/dLFdh0a92fhxoTgZVf/giphy.gif",
                        "https://media.giphy.com/media/vtjMER18uH2bX4VUHq/giphy.gif",
                        "https://media.giphy.com/media/xVMLgxUrQR1inwGpem/giphy.gif",
                    ]
                )
            );

        await interaction.reply({ content: `<@${member.id}>`, embeds: [embed] });
    },
};