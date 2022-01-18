const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    description: "shows current song",

    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            await interaction.reply({
                content: "this command can only be used inside a voice channel",
                ephemeral: true
            });

            return;
        }

        if (
            !interaction.member.voice.channel.members.has(client.id) &&
            client.voice.adapters.get(interaction.guildId)
        ) {
            await interaction.reply({
                content: "u cannot use this command if you're not in the same voice channel as hazel",
                ephemeral: true
            });

            return;
        }

        if (!queue) {
            await interaction.reply("no queue available to use this command");

            return;
        }

        const song = queue.songs[0];

        const embed = new MessageEmbed()
            .setTitle(song.name)
            .setFields(
                {
                    name: "channel",
                    value: song.uploader.name,
                    inline: true
                },
                {
                    name: "song duration",
                    value: `${queue.formattedCurrentTime}/${song.formattedDuration}`,
                    inline: true
                },
                {
                    name: "requested by",
                    value: song.user.username,
                    inline: true
                },
                {
                    name: "next up",
                    value: queue.songs[1]?.name || "none",
                    inline: true
                }
            )
            .setTimestamp()
            .setColor("#8b81a5");

        await interaction.reply({
            embeds: [embed]
        });
    }
};