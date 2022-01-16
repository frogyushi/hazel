const permissionSchema = require("../../models/permissionSchema");

module.exports = {
    name: "permission",
    description: "configure permissions for commands",
    ownerOnly: true,
    options: [
        {
            name: "set",
            description: "permit role to use command",
            type: 1,
            options: [
                {
                    name: "command",
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
            ]
        }
    ],

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        const options = {
            command: interaction.options.getString("command"),
            role: interaction.options.getRole("role").id,
            permission: interaction.options.getBoolean("permission")
        };

        const command = await client.commands.get(options.command);

        if (!command) {
            await interaction.reply(
                {
                    content: "provided command doesn't exist, please check for a valid command",
                    ephemeral: true
                }
            );

            return;
        }

        if (subcommand === "set") {
            const data = await permissionSchema.findOne(
                {
                    guildId: interaction.guildId,
                    command: options.command,
                    role: options.role
                }
            );

            if (!data) {
                const schema = await permissionSchema.create(
                    {
                        guildId: interaction.guildId,
                        command: options.command,
                        role: options.role,
                        permission: options.permission
                    }
                );

                schema.save();
            } else {
                await permissionSchema.findOneAndUpdate(
                    {
                        guildId: interaction.guildId,
                        command: options.command,
                        role: options.role,
                    },
                    { permission: options.permission }
                );
            }

            await interaction.reply(`set permission of role to \`${options.permission}\` for \`${options.command}\` command`);

            client.setSlashPermissionsGuild(interaction.guild);
        }
    }
};