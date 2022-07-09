const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    description: "Provide information on the currently playing song",

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

        const song = queue.songs[0];

        const embed = new MessageEmbed()
            .setTitle(song.name)
            .setFields(
                {
                    name: "channel",
                    value: song.uploader.name,
                    inline: true,
                },
                {
                    name: "song duration",
                    value: `${queue.formattedCurrentTime}/${song.formattedDuration}`,
                    inline: true,
                },
                {
                    name: "requested by",
                    value: song.user.username,
                    inline: true,
                },
                {
                    name: "next up",
                    value: queue.songs[1]?.name || "none",
                    inline: true,
                }
            )
            .setTimestamp()
            .setColor(client.color);

        await interaction.reply({
            embeds: [embed],
        });
    },
};
