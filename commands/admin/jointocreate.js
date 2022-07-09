const joinToCreateSchema = require("../../models/joinToCreateSchema");

module.exports = {
    name: "jointocreate",
    description: "Set up a join-to-create voice channel",
    ownerOnly: true,
    options: [
        {
            type: 7,
            name: "voice_channel",
            description: "Provide a voice channel to act as a join-to-create voice channel",
            channel_types: [2],
        },
        {
            type: 5,
            name: "enabled",
            description: "Enable/disable join-to-create",
        },
    ],

    async execute(client, interaction) {
        const channel = interaction.options.getChannel("voice_channel");
        const temp = {};

        const options = {
            channelId: channel?.id,
            isEnabled: interaction.options.getBoolean("enabled"),
        };

        for (const opt in options) {
            if (options[opt] !== null && options[opt] !== undefined) {
                temp[opt] = options[opt];
            }
        }

        if (!options.channelId && options.isEnabled === null) {
            await interaction.reply({
                content: "no options were provided",
                ephemeral: true,
            });

            return;
        }

        const schema = await joinToCreateSchema.findOne({
            guildId: interaction.guildId,
        });

        if (!schema?.channelId && options.isEnabled && !options.channelId) {
            await interaction.reply({
                content: "cannot update/change setting, no voice channel has been configured",
                ephemeral: true,
            });

            return;
        }

        const updatedSchema = await joinToCreateSchema.findOneAndUpdate(
            { guildId: interaction.guildId },
            temp,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        const guildChannel = interaction.guild.channels.cache.get(updatedSchema.channelId);

        if (!guildChannel?.name) {
            await interaction.reply({
                content:
                    "join-to-create voice channel is not found. please update your configuration",
                ephemeral: true,
            });

            return;
        }

        await interaction.reply(
            `join-to-create voice channel \`${guildChannel.name}\` has been updated and set to \`${updatedSchema.isEnabled}\``
        );
    },
};
