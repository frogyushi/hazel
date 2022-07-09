const rolesSchema = require("../../models/colorRolesSchemas");

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === "color") {
            const selected = interaction.values[0];

            const colors = await rolesSchema.find({
                guildId: interaction.guild.id,
            });

            const color = await rolesSchema.findOne({
                guildId: interaction.guild.id,
                roleName: selected,
            });

            const roles = colors.map((c) => c.roleId);

            for (const [id] of interaction.member.roles.cache) {
                if (!roles.includes(id)) continue;
                const role = await interaction.guild.roles.cache.get(id);
                interaction.member.roles.remove(role);
            }

            const role = interaction.guild.roles.cache.get(color.roleId);
            interaction.member.roles.add(role);

            await interaction.reply({
                content: `added \`${color.roleName}\` to your roles`,
                ephemeral: true,
            });
        }
    },
};
