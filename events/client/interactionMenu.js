const menuOptions = require("../../menu-options.json");

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === "color") {
            const role = interaction.values[0];
            const roles = Object.values(menuOptions.color);

            for (const [id] of interaction.member.roles.cache) {
                if (!roles.includes(id)) continue;
                const userRole = await interaction.guild.roles.cache.get(id);
                interaction.member.roles.remove(userRole);
            }

            if (selectedRole === "remove") {
                await interaction.reply(
                    {
                        content: "roles have been removed",
                        ephemeral: true
                    }
                );

                return;
            }

            const roleId = interaction.guild.roles.cache.get(menuOptions.color[role]);
            interaction.member.roles.add(roleId);

            await interaction.reply(
                {
                    content: `added role \`${role}\` to your role list`,
                    ephemeral: true
                }
            );
        };
    }
};