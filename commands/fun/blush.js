const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "blush",
    description: "blush",
    options: [
        {
            name: "user",
            description: "select a user",
            type: 6,
        }
    ],

    async execute(client, interaction) {
        const member = interaction.options.getUser("user");

        const embed = new MessageEmbed()
            .setColor("#8b81a5")
            .setDescription(member ?
                `<@${interaction.member.id}> has blushed towards <@${member.id}>` :
                `<@${interaction.member.id}> has blushed`
            )
            .setImage(
                client.getRandomArrayElement(
                    [
                        "https://media.giphy.com/media/109ltuoSQT212w/giphy.gif",
                        "https://media.giphy.com/media/ye7OTQgwmVuVy/giphy.gif",
                        "https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.gif",
                        "https://media.giphy.com/media/SWjOyVOcUECfdG7dQm/giphy.gif",
                        "https://media.giphy.com/media/S6NIIbtNYOTtvgdwWC/giphy.gif",
                        "https://media.giphy.com/media/QWRln9pNiBmJt1Krks/giphy.gif",
                        "https://media.giphy.com/media/S5uT7KROKtGCON9w4c/giphy.gif",
                        "https://media.giphy.com/media/S98oiYhUk7pa6RjC7C/giphy.gif",
                        "https://media.giphy.com/media/eMtJldMsmIbQkcewyx/giphy.gif",
                        "https://media.giphy.com/media/l1rejhOyfxSdzOgIfx/giphy.gif",
                    ]
                )
            );


        let object = { embeds: [embed] };

        if (member) object = { ...object, content: `<@${member.id}>` };

        await interaction.reply(object);
    },
};