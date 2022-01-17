const permissionSchema = require("../../models/permissionSchema");

module.exports = {
    name: "permission",
    description: "set permissions for commands",
    ownerOnly: true,
    options: [
        {
            name: "command_name",
            description: "provide command name",
            type: 3,
            required: true
        },
        {
            type: 8,
            name: "role",
            description: "provide a role to add",
            required: true
        },
        {
            type: 5,
            name: "permission",
            description: "enable/disable permission",
            required: true
        },
    ],

    async execute(client, interaction) {
        const options = {
            commandName: interaction.options.getString("command_name"),
            roleId: interaction.options.getRole("role").id,
            hasPermission: interaction.options.getBoolean("permission")
        };

        const command = await client.commands.get(options.commandName);

        if (!command) {
            await interaction.reply(
                {
                    content: "provided command doesn't exist, please check for a valid command",
                    ephemeral: true
                }
            );

            return;
        }

        const data = await permissionSchema.findOne(
            {
                guildId: interaction.guildId,
                commandName: options.commandName,
                roleId: options.roleId
            }
        );

        if (!data) {
            const schema = await permissionSchema.create(
                {
                    guildId: interaction.guildId,
                    commandName: options.commandName,
                    roleId: options.roleId,
                    hasPermission: options.hasPermission
                }
            );

            schema.save();
        } else {
            await permissionSchema.findOneAndUpdate(
                {
                    guildId: interaction.guildId,
                    commandName: options.commandName,
                    roleId: options.roleId,
                },
                { hasPermission: options.hasPermission }
            );
        }

        await interaction.reply(`set permission of role to \`${options.hasPermission}\` for \`${options.commandName}\` command`);

        client.setSlashPermissionsGuild(interaction.guild);
    }
};