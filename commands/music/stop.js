module.exports = {
    name: "stop",
    description: "Stop playback",

    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            await interaction.reply({
                content: "this command cannot be used outside of a voice channel",
                ephemeral: true,
            });

            return;
        }

        if (
            !interaction.member.voice.channel.members.has(client.id) &&
            client.voice.adapters.get(interaction.guildId)
        ) {
            await interaction.reply({
                content: "this command cannot be used without attending a voice channel with Hazel",
                ephemeral: true,
            });

            return;
        }

        if (!queue) {
            await interaction.reply({
                content: "no queue available to use this command",
                ephemeral: true,
            });

            return;
        }

        queue.stop();

        await interaction.reply("queue has been cleared");
    },
};
