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
            channel_types: [2]
        },
        {
            type: 5,
            name: "enabled",
            description: "enable/disable welcome messages"
        },
    ],

    async execute(client, interaction) {
        const channel = interaction.options.getChannel("voice_channel");

        const temp = {};

        const options = {
            channelId: channel?.id,
            enabled: interaction.options.getBoolean("enabled")
        };

        for (const opt in options) {
            if (options[opt] !== null && options[opt] !== undefined) {
                temp[opt] = options[opt];
            }
        }

        if (!options.channelId && options.enabled === null) {
            await interaction.reply(
                {
                    content: "no options were provided",
                    ephemeral: true
                }
            );

            return;
        }

        const schema = await joinToCreateSchema.findOne({ guildId: interaction.guildId });

        if (!schema?.channelId && options.enabled) {
            await interaction.reply(
                {
                    content: "cannot update/change setting, no voice channel set",
                    ephemeral: true
                }
            );

            return;
        }

        const newSchema = await joinToCreateSchema.findOneAndUpdate({ guildId: interaction.guildId }, temp, { upsert: true, new: true, setDefaultsOnInsert: true });

        await interaction.reply(`voice channel \`${newSchema.channelId}\` has been updated and set as \`${newSchema.enabled}\``);
    },
};