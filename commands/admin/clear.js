module.exports = {
    name: "clear",
    description: "removes a specified amount of messages",
    permissions: ["owner", "manager"],
    options: [
        {
            name: "number",
            description: "specify an amount of messages to be removed",
            type: 10,
            required: true
        }
    ],

    async execute(client, interaction) {
        const selectedAmount = interaction.options.getNumber("number");

        if (selectedAmount < 1) {
            await interaction.reply(
                {
                    content: "specified amount cannot be negative",
                    ephemeral: true
                }
            );

            return;
        }

        if (selectedAmount > 100) {
            await interaction.reply(
                {
                    content: "specified amount cannot be greater than 100",
                    ephemeral: true
                }
            );

            return;
        }

        await interaction.channel.bulkDelete(selectedAmount, true);

        await interaction.reply(
            {
                content: `i have deleted \`${selectedAmount}\` messages`,
                ephemeral: true
            }
        );
    },
};