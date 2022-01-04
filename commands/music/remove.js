module.exports = {
    name: "remove",
    description: "removes a song from queue",
    options: [
        {
            name: "number",
            description: "specify index of song to remove",
            type: 10,
            required: true
        }
    ],

    async execute(client, interaction) {
        const index = interaction.options.getNumber("number", true);
        const queue = client.distube.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            await interaction.reply(
                {
                    content: "this command can only be used inside a voice channel",
                    ephemeral: true
                }
            );

            return;
        }

        if (!interaction.member.voice.channel.members.has(client.CLIENT_ID) && client.voice.adapters.get(interaction.guildId)) {
            await interaction.reply(
                {
                    content: "u cannot use this command if you're not in the same voice channel as hazel",
                    ephemeral: true
                }
            );

            return;
        }

        if (!queue) {
            await interaction.reply("no queue available to use this command");

            return;
        }

        const songs = queue.songs;
        const song = songs[index];

        if (!song) {
            await interaction.reply(
                {
                    content: "specified song is not in queue",
                    ephemeral: true
                }
            );

            return;
        }

        songs.splice(index, 1);

        await interaction.reply(`i have removed \`${song.name}\` from queue`);
    },
};