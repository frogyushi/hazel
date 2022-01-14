const menuOptions = require("../../menu-options.json");

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) {
            return;
        };

        if (interaction.customId === "color") {
            const selectedRole = interaction.values[0];
            const roles = Object.values(menuOptions.color);

            for (const [id] of interaction.member.roles.cache) {
                if (!roles.includes(id)) continue;

                const userRole = await interaction.guild.roles.cache.get(id);
                interaction.member.roles.remove(userRole);
            }

            const role = interaction.guild.roles.cache.get(menuOptions.color[selectedRole]);
            interaction.member.roles.add(role);

            await interaction.reply(
                {
                    content: `added role \`${selectedRole}\` to your role list`,
                    ephemeral: true
                }
            );
        };
    }
};