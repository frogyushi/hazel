module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command || command.disabled) return;

        command.execute(client, interaction);
    }
};