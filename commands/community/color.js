const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const options = require("../../menu-options.json");

module.exports = {
    name: "color",
    description: "manage user's color role",
    guildOnly: true,
    options: [
        {
            name: "add",
            description: "set a color role",
            type: 1
        },
        {
            name: "remove",
            description: "remove user's color role",
            type: 1
        }
    ],

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "remove") {
            const roles = Object.values(options.color);
            let isRoleFound = false;

            for (const [id] of interaction.member.roles.cache) {
                if (!roles.includes(id)) continue;
                const userRole = await interaction.guild.roles.cache.get(id);
                isRoleFound = true;
                await interaction.member.roles.remove(userRole);
            }

            const replyContent = isRoleFound ?
                "color role has been removed from role list" :
                "no color roles found to remove";

            await interaction.reply(
                {
                    content: replyContent,
                    ephemeral: true
                }
            );
        }

        if (subcommand === "add") {
            const selectMenu = new MessageSelectMenu()
                .setCustomId("color")
                .setPlaceholder("no color selected");

            selectMenu.addOptions(
                [
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
                ]
            );

            const row = new MessageActionRow().addComponents(selectMenu);

            await interaction.reply(
                {
                    content: "select a color to be added to your role list",
                    components: [row],
                    ephemeral: true
                }
            );
        }
    },
};