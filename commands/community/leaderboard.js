const { MessageEmbed } = require("discord.js");
const memberSchema = require("../../models/memberSchema");

module.exports = {
    name: "leaderboard",
    description: "show ranking of most active members",

    async execute(client, interaction) {
        const schemas = await memberSchema.find({ guildId: interaction.guildId });
        const memberData = schemas.sort(({ messages: a }, { messages: b }) => b - a).entries();

        const entries = {
            tags: [],
            messages: []
        };

        for (const [index, { userTag, messages }] of memberData) {
            entries.tags.push(`**${index + 1}** - ${userTag}`);
            entries.messages.push(messages);
        }

        const embed = new MessageEmbed()
            .setTitle("leaderboard")
            .setDescription("list of most active members in this server by messages")
            .addFields(
                {
                    name: "members",
                    value: entries.tags.slice(0, 10).join("\n\n") || "none",
                    inline: true
                },
                {
                    name: "messages",
                    value: entries.messages.slice(0, 10).join("\n\n") || "none",
                    inline: true
                },
            )
            .setColor("#8b81a5")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};