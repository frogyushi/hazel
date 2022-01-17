module.exports = {
    name: "movetop",
    description: "moves selected song to top of queue",
    options: [
        {
            name: "index",
            description: "specify index of song to move",
            type: 10,
            required: true
        }
    ],

    async execute(client, interaction) {
        const index = interaction.options.getNumber("index", true);
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

        if (!interaction.member.voice.channel.members.has(client.id) && client.voice.adapters.get(interaction.guildId)) {
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

        await songs.splice(index, 1);
        await songs.splice(1, 0, song);

        await interaction.reply(`i have moved \`${song.name}\` to queue next`);
    },
};