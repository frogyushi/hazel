const welcomeSchema = require("../../models/welcomeSchema");

module.exports = {
    name: "welcome",
    description: "set up your welcome message",
    permissions: ["owner"],
    options: [
        {
            type: 1,
            name: "settings",
            description: "configure welcome message settings",
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "set welcome channel",
                    required: true
                },
                {
                    type: 5,
                    name: "enabled",
                    description: "enable/disable welcome messages",
                },
            ]
        },
        {
            type: 1,
            name: "message",
            description: "configure welcome message. write {member} to display joined member's name and {guild} for guild name",
            options: [
                {
                    type: 3,
                    name: "description",
                    description: "set a description",
                },
                {
                    type: 3,
                    name: "color",
                    description: "set a color using hex value e.g #000000"
                },
                {
                    type: 3,
                    name: "title",
                    description: "set a title"
                },
                {
                    type: 3,
                    name: "image",
                    description: "set an image using an imgur url"
                },
                {
                    type: 3,
                    name: "footer",
                    description: "set a footer"
                },
                {
                    type: 5,
                    name: "timestamp",
                    description: "set a timestamp"
                }
            ]
        }
    ],

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        const data = await welcomeSchema.findOne({ guildId: interaction.guildId });

        if (subcommand === "settings") {
            const channel = interaction.options.getChannel("channel");

            if (!data) {
                await interaction.reply("cannot access settings if welcome message is not created yet");
                return;
            }

            if (channel.type !== "GUILD_TEXT") {
                await interaction.reply("specified channel has to be a text channel");
                return;
            };

            await welcomeSchema.findOneAndUpdate({ guildId: interaction.guildId },
                {
                    channelId: channel.id,
                    enabled: interaction.options.getBoolean("enabled") || true
                }
            );

            await interaction.reply("settings have been updated");
        }

        if (subcommand === "message") {
            const template = {};

            const embed = {
                color: interaction.options.getString("color"),
                title: interaction.options.getString("title"),
                description: interaction.options.getString("description"),
                image: interaction.options.getString("image"),
                footer: interaction.options.getString("footer"),
                timestamp: interaction.options.getBoolean("timestamp")
            };

            if (!client.isHexColor(embed.color)) {
                await interaction.reply(
                    {
                        content: "color option must represent a hex color value",
                        ephemeral: true
                    }
                );

                return;
            }

            for (const prop in embed) {
                if (!embed[prop]) {
                    template[prop] = embed[prop];
                }
            }

            if (!embed) {
                await interaction.reply(
                    {
                        content: "cannot create/update welcome message since no options were given",
                        ephemeral: true
                    }
                );

                return;
            }

            if (!description && !title && !image) {
                await interaction.reply(
                    {
                        content: "welcome message must include one description, title, or image",
                        ephemeral: true
                    }
                );

                return;
            }

            if (!data) {
                const schema = await welcomeSchema.create(
                    {
                        guildId: interaction.guildId,
                        enabled: true,
                        ...template
                    }
                );

                schema.save();

                await interaction.reply("welcome message has been created");
                return;
            }

            await welcomeSchema.findOneAndUpdate({ guildId: interaction.guildId }, template);
            await interaction.reply("welcome message has been updated");
        }
    }
};