module.exports = {
    name: "echo",
    description: "echoes a message",
    permissions: ["owner"],
    options: [
        {
            name: "text",
            description: "specify a message to be echoed",
            type: 3,
            required: true
        }
    ],

    async execute(client, interaction) {
        await interaction.deferReply();
        await interaction.deleteReply();

        interaction.channel.send(interaction.options.getString("text"));
    },
};