const config = require("../../config.json");

module.exports = {
    name: "playskip",
    description: "plays a song and skips to it",
    options: [
        {
            name: "text",
            description: "youtube, spotify",
            type: 3,
            required: true
        }
    ],

    async execute(client, interaction) {
        const query = interaction.options.getString("text");

        if (!interaction.member.voice.channel) {
            await interaction.reply(
                {
                    content: "this command can only be used inside a voice channel",
                    ephemeral: true
                }
            );

            return;
        }

        if (!interaction.member.voice.channel.members.has(config.clientId) && client.voice.adapters.get(interaction.guildId)) {
            await interaction.reply(
                {
                    content: "u cannot use this command if you're not in the same voice channel as hazel",
                    ephemeral: true
                }
            );

            return;
        }

        client.distube.playVoiceChannel(interaction.member.voice.channel, query,
            {
                textChannel: interaction.channel,
                member: interaction.member,
                skip: true
            }
        );

        await interaction.reply(`searching: \`${query}\``);
    }
};