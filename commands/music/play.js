module.exports = {
    name: "play",
    description: "Request a playback",
    options: [
        {
            name: "query",
            description: "Provide a search query",
            type: 3,
            required: true,
        },
    ],

    async execute(client, interaction) {
        const query = interaction.options.getString("query");

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

        client.distube.play(interaction.member.voice.channel, query, {
            textChannel: interaction.channel,
            member: interaction.member,
        });

        await interaction.reply(`searching \`${query}\``);
    },
};
