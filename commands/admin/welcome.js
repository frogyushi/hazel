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
            description: "configure welcome message",
            options: [
                {
                    type: 3,
                    name: "description",
                    description: "set a description",
                    required: true
                },
                {
                    type: 3,
                    name: "color",
                    description: "set a color"
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

        if (subcommand === "message") {
            const config = {
                color: interaction.options.getString("color") || "",
                title: interaction.options.getString("title") || "",
                description: interaction.options.getString("description") || "",
                image: interaction.options.getString("image") || "",
                footer: interaction.options.getString("footer") || "",
                timestamp: interaction.options.getBoolean("timestamp") || false,
            };

            if (!data) {
                const schema = await welcomeSchema.create(
                    {
                        guildId: interaction.guildId,
                        channelId: "",
                        enabled: true,
                        ...config
                    }
                );

                schema.save();

                await interaction.reply("welcome message has been created");
                return;
            }

            if (data) {
                await welcomeSchema.findOneAndUpdate({ guildId: interaction.guildId }, config);
                await interaction.reply("welcome message has been updated");
                return;
            }
        }

        if (subcommand === "settings") {
            if (!data) {
                await interaction.reply("cannot access settings if welcome message is not created yet");
                return;
            }

            if (data) {
                const channel = interaction.options.getChannel("channel");

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
        }
    }
};