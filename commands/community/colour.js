const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const menuOptions = require("../../menu-options.json");

module.exports = {
    name: "colour",
    description: "manage user's colour role",
    options: [
        {
            name: "add",
            description: "set a colour role",
            type: 1
        },
        {
            name: "remove",
            description: "remove user's colour role",
            type: 1
        }
    ],

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "remove") {
            const roles = Object.values(menuOptions.colour);

            let isRoleFound = false;

            for (const [id] of interaction.member.roles.cache) {
                if (!roles.includes(id)) continue;

                isRoleFound = true;

                const userRole = await interaction.guild.roles.cache.get(id);
                await interaction.member.roles.remove(userRole);
            }

            const replyContent = isRoleFound ? "colour role has been removed from role list" : "no colour roles found to remove";

            await interaction.reply(
                {
                    content: replyContent,
                    ephemeral: true
                }
            );
        }

        if (subcommand === "add") {
            const selectMenu = new MessageSelectMenu()
                .setCustomId("colour")
                .setPlaceholder("no colour selected");

            selectMenu.addOptions(
                [
                    {
                        label: "baby blue",
                        emoji: "923215493484134420",
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
                    }
                ]
            );

            const row = new MessageActionRow().addComponents(selectMenu);

            await interaction.reply(
                {
                    content: "select a colour to be added to your role list",
                    components: [row],
                    ephemeral: true
                }
            );
        }
    },
};