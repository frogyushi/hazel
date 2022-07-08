const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "embed",
    description: "Create an embed",
    ownerOnly: true,
    options: [
        {
            name: "title",
            description: "Set a title",
            type: 3,
            required: true,
        },
        {
            name: "description",
            description: "Set description",
            type: 3,
            required: true,
        },
    ],

    async execute(client, interaction) {
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");

        await interaction.deferReply();
        await interaction.deleteReply();

        const embed = new MessageEmbed()
            .setColor("#6C78AD")
            .setTitle(title)
            .setDescription(description.replace(/\n/g, "\n"));

        interaction.channel.send({ embeds: [embed] });
    },
};
