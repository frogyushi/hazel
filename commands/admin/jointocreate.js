const joinToCreateSchema = require("../../models/joinToCreateSchema");

module.exports = {
    name: "jointocreate",
    description: "set a join to create voice channel",
    permissions: ["owner"],
    options: [
        {
            type: 7,
            name: "channel",
            description: "set a join to create voice channel",
            required: true
        },
        {
            type: 5,
            name: "enabled",
            description: "enable/disable welcome messages",
        },
    ],

    async execute(client, interaction) {
        const channel = interaction.options.getChannel("channel");

        if (channel.type !== "GUILD_VOICE") {
            await interaction.reply("specified channel has to be a voice channel");
            return;
        };

        const data = await joinToCreateSchema.findOne({ guildId: interaction.guildId });

        if (!data) {
            const schema = await joinToCreateSchema.create(
                {
                    guildId: interaction.guildId,
                    channelId: channel.id,
                    enabled: interaction.options.getBoolean("enabled") || false
                }
            );

            schema.save();

            await interaction.reply("join to create voice channel has been set");
            return;
        }

        if (data) {
            await joinToCreateSchema.findOneAndUpdate({ guildId: interaction.guildId },
                {
                    channelId: channel.id,
                    enabled: interaction.options.getBoolean("enabled") || false
                }
            );

            await interaction.reply("join to create voice channel has been updated");
        }
    },
};