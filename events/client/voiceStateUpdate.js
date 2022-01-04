module.exports = {
    name: "voiceStateUpdate",

    async execute(client, oldState, newState) {
        if (client.temporaryVoiceChannels.get(oldState.channelId) && !oldState.channel.members.size) {
            oldState.channel.delete();

            return;
        }

        if (newState.channelId !== "922111171962748938") return;

        const { guild, user, voice, id } = newState.member;

        const vc = await guild.channels.create(`${user.username}'s channel`,
            {
                type: "GUILD_VOICE",
                parent: "913854802121883698",
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
    }
};

