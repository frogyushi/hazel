const joinToCreateSchema = require("../../models/joinToCreateSchema");

module.exports = {
    name: "voiceStateUpdate",

    async execute(client, oldState, newState) {
        const schema = await joinToCreateSchema.findOne({ guildId: oldState.guild.id || newState.guild.id });

        if (!schema?.enabled) return;

        if (newState?.channelId === schema?.channelId) {
            const { guild, user, voice, id } = newState.member;

            const parent = newState.channel?.parentId;
            const parentId = parent ? { parent } : {};

            const vc = await guild.channels.create(`${user.username}'s channel`,
                {
                    type: "GUILD_VOICE",
                    ...parentId,
                    permissionOverwrites: [
                        {
                            id: id,
                            allow: ['MANAGE_CHANNELS'],
                        }
                    ]
                }
            );

            client.temporaryVoiceChannels.set(vc.id, newState.member);
            voice.setChannel(vc.id);
        };

        if (client.temporaryVoiceChannels.get(oldState.channelId) && !oldState.channel.members.size) {
            oldState.channel.delete();
            return;
        }
    }
};

