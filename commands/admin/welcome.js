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
            const embed = {};

            const color = interaction.options.getString("color");
            const title = interaction.options.getString("title");
            const description = interaction.options.getString("description");
            const image = interaction.options.getString("image");
            const footer = interaction.options.getString("footer");
            const timestamp = interaction.options.getBoolean("timestamp");

            if (client.isHexColor(color)) {
                embed.color = color;
            } else {
                await interaction.reply(
                    {
                        content: "color option must represent a hex color value",
                        ephemeral: true
                    }
                );

                return;
            }

            if (color) embed.color = color;
            if (title) embed.title = title;
            if (description) embed.description = description;
            if (image) embed.image = image;
            if (footer) embed.footer = footer;
            if (timestamp) embed.timestamp = timestamp;

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
                        enabled: true
                    }
                );

                schema.save();

                await interaction.reply("welcome message has been created");
                return;
            }

            await welcomeSchema.findOneAndUpdate({ guildId: interaction.guildId }, embed);
            await interaction.reply("welcome message has been updated");
        }
    }
};