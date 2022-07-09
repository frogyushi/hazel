const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "addSong",

    async execute(client, queue, song) {
        const embed = new MessageEmbed()
            .setAuthor({ name: "added to queue ♡" })
            .setTitle(song.name)
            .setFields(
                {
                    name: "channel",
                    value: song.uploader.name,
                    inline: true,
                },
                {
                    name: "song duration",
                    value: song.formattedDuration,
                    inline: true,
                },
                {
                    name: "estimate time of playing",
                    value: queue.formattedCurrentTime,
                    inline: true,
                },
                {
                    name: "position in queue",
                    value: (queue.songs.length - 1 || "none").toString(),
                    inline: true,
                }
            )
            .setTimestamp()
            .setColor(client.color);

        queue.textChannel.send({
            embeds: [embed],
        });
    },
};
