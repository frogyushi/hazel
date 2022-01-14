const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue",
    description: "shows queue",
    options: [
        {
            name: "page",
            description: "specify which page to be displayed",
            type: 10,
        }
    ],

    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction.guildId);
        let page = Math.floor(interaction.options.getNumber("page")) || 0;

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

        const currentQueue = {
            current: "",
            queued: []
        };

        for (const [id, song] of queue.songs.entries()) {
            if (!id) {
                currentQueue.current = `${song.name} - ${song.formattedDuration}`;

                continue;
            }

            currentQueue.queued.push(`**${id}** - ${song.name} - ${song.formattedDuration}`);
        }

        const maxSongs = Math.ceil(currentQueue.queued.length / 10);
        const pageDisplay = page === 1 || page ? ((page * 10) - 10) : 0;

        const embed = new MessageEmbed()
            .setTitle("now playing")
            .setDescription(currentQueue.current)
            .addFields(
                {
                    name: "next up",
                    value: currentQueue.queued.slice(0 + pageDisplay, 10 + pageDisplay).join("\n\n") || "none"
                }
            )
            .setColor("#8b81a5")
            .setFooter(`page ${page || 1}/${maxSongs || 1} - ${queue.songs.length - 1 || "no"} songs in queue - ${queue.formattedDuration}`)
            .setTimestamp();

        await interaction.reply(
            {
                embeds: [embed]
            }
        );
    }
};

