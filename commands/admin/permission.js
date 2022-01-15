const permissionSchema = require("../../models/permissionSchema");

module.exports = {
    name: "permission",
    description: "configure permissions for commands",
    ownerOnly: true,
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
            description: "provide a role to whitelist",
            required: true
        },
    ],

    async execute(client, interaction) {
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
                    content: "cannot set/update permissions since no options were provided",
                    ephemeral: true
                }
            );

            return;
        }

        const command = await client.commands.get(options.command);

        if (!options.role) {
            await interaction.reply(
                {
                    content: "provided role is not found",
                    ephemeral: true
                }
            );

            return;
        }

        if (!command) {
            await interaction.reply(
                {
                    content: "provided command is not found",
                    ephemeral: true
                }
            );

            return;
        }

        const data = await permissionSchema.findOne({ command: options.command, role: options.role });

        if (data) {
            await interaction.reply(
                {
                    content: "role has already been whitelisted on this command",
                    ephemeral: true
                }
            );

            return;
        };

        const schema = await permissionSchema.create(
            {
                guildId: interaction.guildId,
                ...template
            }
        );

        schema.save();

        await interaction.reply("settings have been updated");
    }
};