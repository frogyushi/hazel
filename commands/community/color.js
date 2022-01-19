const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "color",
    description: "manage user's color role",
    guild: true,

    async execute(client, interaction) {
        const selectMenu = new MessageSelectMenu()
            .setCustomId("color")
            .setPlaceholder("no color selected")
            .addOptions([
                {
                    label: "none",
                    value: "remove"
                },
                {
                    label: "baby blue",
                    emoji: "929780363436380172",
                    value: "baby blue"
                },
                {
                    label: "blush",
                    emoji: "923215493614161940",
                    value: "blush"
                },
                {
                    label: "tea green",
                    emoji: "923215493077291029",
                    value: "tea green"
                },
                {
                    label: "peach",
                    emoji: "923215493589008415",
                    value: "peach"
                },
                {
                    label: "powder pink",
                    emoji: "923215493463150602",
                    value: "powder pink"
                },
                {
                    label: "vanilla",
                    emoji: "923215493333131285",
                    value: "vanilla"
                },
                {
                    label: "cosmic",
                    emoji: "929779253069873152",
                    value: "cosmic"
                }
            ]);

        const row = new MessageActionRow().addComponents(selectMenu);

        await interaction.reply({
            content: "select a role to be added",
            components: [row],
            ephemeral: true
        });
    },
};