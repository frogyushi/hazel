const rolesSchema = require("../../models/colorRolesSchemas");
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");

module.exports = {
    name: "color",
    description: "manage user's colour role",
    guildOnly: true,
    options: [
        {
            name: "add",
            description: "Set a color to be added to your roles",
            type: 1,
        },
        {
            name: "remove",
            description: "Remove user's color",
            type: 1,
        },
    ],

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        const colors = await rolesSchema.find({
            guildId: interaction.guild.id,
        });

        if (subcommand === "remove") {
            const roles = colors.map((c) => c.roleId);
            let found = false;
            let color = {};

            for (const [id] of interaction.member.roles.cache) {
                if (!roles.includes(id)) continue;

                color = await rolesSchema.findOne({
                    guildId: interaction.guild.id,
                    roleId: id,
                });

                const role = await interaction.guild.roles.cache.get(id);
                await interaction.member.roles.remove(role);
                found = true;
            }

            await interaction.reply({
                content: found
                    ? `\`${color.roleName}\` has been removed from your roles`
                    : "No color found to remove in your roles",
                ephemeral: true,
            });
        }

        if (subcommand === "add") {
            const menu = new MessageSelectMenu()
                .setCustomId("color")
                .setPlaceholder("no color selected");

            menu.addOptions(
                colors.map((key) => {
                    return {
                        label: key.roleName,
                        emoji: key.emojiId,
                        value: key.roleName,
                    };
                })
            );

            const embed = new MessageEmbed()
                .setColor("#6C78AD")
                .setTitle("color ♡")
                .setDescription(
                    "select a color to be added to your roles\n\n⋅ use `/color remove` to remove your color"
                );

            await interaction.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents(menu)],
                ephemeral: true,
            });
        }
    },
};
