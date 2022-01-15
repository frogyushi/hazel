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
            ]
        },
        {
            name: "remove",
            description: "remove permission from role",
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
                    description: "provide a role to remove",
                    required: true
                },
            ]
        },
    ],

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        const template = {};

        const options = {
            command: interaction.options.getString("command"),
            role: interaction.options.getRole("role")?.id,
        };

        for (const prop in options) {
            if (options[prop] !== null && options[prop] !== undefined) {
                template[prop] = options[prop];
            }
        }

        if (!Object.keys(template).length) {
            await interaction.reply(
                {
                    content: "cannot update permissions since no options were provided",
                    ephemeral: true
                }
            );

            return;
        }

        if (!options.role) {
            await interaction.reply(
                {
                    content: "provided role doesn't exist",
                    ephemeral: true
                }
            );

            return;
        }

        const command = await client.commands.get(options.command);

        if (!command) {
            await interaction.reply(
                {
                    content: "provided command doesn't exist",
                    ephemeral: true
                }
            );

            return;
        }

        if (subcommand === "set") {
            const data = await permissionSchema.findOne({ guildId: interaction.guildId, command: options.command, role: options.role });

            if (data) {
                await interaction.reply(
                    {
                        content: "role already has permission on this command",
                        ephemeral: true
                    }
                );

                return;
            };

            const schema = await permissionSchema.create({ guildId: interaction.guildId, ...template });
            schema.save();

            const fullPermissions = [];

            const commands = await permissionSchema.find({ guildId: interaction.guildId, command: options.command });
            const { id } = await client.application.commands.cache.find(({ name }) => name === command.name);

            if (!command?.ownerOnly) return;

            if (commands.length) {
                for (const { role } of commands) {
                    fullPermissions.push(
                        {
                            commandId: id,
                            permissions: [
                                {
                                    id: interaction.guild.ownerId,
                                    type: 2,
                                    permission: true
                                },
                                {
                                    id: role,
                                    type: 1,
                                    permission: true
                                }
                            ]
                        }
                    );
                }
            } else {
                fullPermissions.push(
                    {
                        commandId: id,
                        permissions: [
                            {
                                id: interaction.guild.ownerId,
                                type: 2,
                                permission: true
                            }
                        ]
                    }
                );
            }

            await client.REST.put(
                Routes.guildApplicationCommandsPermissions(client.id, interaction.guildId),
                { body: fullPermissions },
            );

            await interaction.reply("permissions have been set");
        }

        if (subcommand === "remove") {
            await permissionSchema.findOneAndDelete({ guildId: interaction.guildId, command: options.command, role: options.role });
            await interaction.reply("provided role has no more permission to use this command");
        }
    }
};