const memberSchema = require("../../models/memberSchema");

module.exports = {
    name: "messageCreate",

    async execute(client, message) {
        if (message.author.bot) return;

        let data = await memberSchema.findOne({ userId: message.author.id });

        if (!data) {
            let member = await memberSchema.create(
                {
                    userId: message.author.id,
                    guildId: message.guild.id,
                    userTag: message.author.tag,
                    messages: 1,
                }
            );

            member.save();

            return;
        }

        if (data) {
            await memberSchema.findOneAndUpdate({ userId: message.author.id },
                {
                    userTag: message.author.tag,
                    $inc: { messages: 1 }
                }
            );
        }
    }
};