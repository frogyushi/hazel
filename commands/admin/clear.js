module.exports = {
    name: "clear",
    description: "Remove a specified amount of messages in a given channel",
    ownerOnly: true,
    options: [
        {
            name: "amount",
            description: "Amount of messages to removed",
            type: 10,
            required: true,
        },
    ],

    async execute(client, interaction) {
        const amount = interaction.options.getNumber("amount");

        if (amount < 1) {
            await interaction.reply({
                content: "Amount must be greater than zero",
                ephemeral: true,
            });

            return;
        }

        if (amount > 100) {
            await interaction.reply({
                content: "Amount must not be greater than 100",
                ephemeral: true,
            });

            return;
        }

        await interaction.channel.bulkDelete(amount, true);

        await interaction.reply({
            content: `I have deleted \`${amount}\` messages`,
            ephemeral: true,
        });
    },
};
