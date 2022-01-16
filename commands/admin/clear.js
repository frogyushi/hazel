module.exports = {
    name: "clear",
    description: "removes a specified amount of messages",
    ownerOnly: true,
    options: [
        {
            name: "amount",
            description: "specify an amount of messages to be removed",
            type: 10,
            required: true
        }
    ],

    async execute(client, interaction) {
        const amount = interaction.options.getNumber("number");

        if (amount < 1) {
            await interaction.reply(
                {
                    content: "specified amount cannot be negative",
                    ephemeral: true
                }
            );

            return;
        }

        if (amount > 100) {
            await interaction.reply(
                {
                    content: "specified amount cannot be greater than 100",
                    ephemeral: true
                }
            );

            return;
        }

        await interaction.channel.bulkDelete(amount, true);

        await interaction.reply(
            {
                content: `i have deleted \`${amount}\` messages`,
                ephemeral: true
            }
        );
    },
};