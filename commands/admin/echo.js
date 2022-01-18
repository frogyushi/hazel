module.exports = {
    name: "echo",
    description: "echoes a message",
    ownerOnly: true,
    options: [
        {
            name: "message",
            description: "specify a message to be echoed",
            type: 3,
            required: true
        }
    ],

    async execute(client, interaction) {
        const message = interaction.options.getString("message");

        await interaction.deferReply();
        await interaction.deleteReply();

        interaction.channel.send(message);
    },
};