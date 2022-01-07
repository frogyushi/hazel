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
        },
        {
            name: "member",
            description: "delete messages only from the specified member",
            type: 6,
        }
    ],

    async execute(client, interaction) {
        const amount = interaction.options.getNumber("number");
        const member = interaction.options.getMember("member");

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

        let messages = interaction.channel.messages.fetch();

        if (member) {
            messages = (await messages).filter((message) => message.author.id === member.id);
        }

        await interaction.channel.bulkDelete(messages, true);

        await interaction.reply(
            {
                content: `i have deleted \`${amount}\` ${member ? `messages of ${member.tag}` : "messages"}`,
                ephemeral: true
            }
        );
    },
};