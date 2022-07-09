module.exports = {
    name: "remove",
    description: "Remove a song from queue",
    options: [
        {
            name: "index",
            description: "specify index of song to remove",
            type: 10,
            required: true,
        },
    ],

    async execute(client, interaction) {
        const index = interaction.options.getNumber("index", true);
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

        const songs = queue.songs;
        const song = songs[index];

        if (!song) {
            await interaction.reply({
                content: "no song was found with this index in the queue",
                ephemeral: true,
            });

            return;
        }

        songs.splice(index, 1);

        await interaction.reply(`removed \`${song.name}\` from queue`);
    },
};
