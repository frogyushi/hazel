const joinToCreateSchema = require("../../models/joinToCreateSchema");

module.exports = {
    name: "jointocreate",
    description: "set a join to create voice channel",
    ownerOnly: true,
    options: [
        {
            type: 7,
            name: "voice_channel",
            description: "set a join to create voice channel",
            channel_types: [2],
            required: true
        },
        {
            type: 5,
            name: "enabled",
            description: "enable/disable welcome messages",
        },
    ],

    async execute(client, interaction) {
        const channel = interaction.options.getChannel("voice_channel");

        const options = {
            channelId: channel?.id,
            enabled: interaction.options.getBoolean("enabled")
        };

        const data = await joinToCreateSchema.findOne({ guildId: interaction.guildId });

        if (!data) {
            const schema = await joinToCreateSchema.create(
                {
                    guildId: interaction.guildId,
                    channelId: options.channelId,
                    enabled: options.enabled || true
                }
            );

            schema.save();
        } else {
            const enabled = options.enabled ? { enabled: options.enabled } : {};

            await joinToCreateSchema.findOneAndUpdate(
                { guildId: interaction.guildId },
                {
                    channelId: options.channelId,
                    ...enabled
                }
            );
        }

        await interaction.reply("settings have been updated");
    },
};