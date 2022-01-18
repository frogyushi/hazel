const welcomeMessageSchema = require("../../models/welcomeMessageSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "welcome",
    description: "set an event on welcome",
    ownerOnly: true,
    options: [
        {
            type: 2,
            name: "message",
            description: "set a welcome message",
            options: [
                {
                    type: 1,
                    name: "embed",
                    description: "create/update embed",
                    options: [
                        {
                            type: 3,
                            name: "title",
                            description: "set a title"
                        },
                        {
                            type: 3,
                            name: "description",
                            description: "set a description"
                        },
                        {
                            type: 3,
                            name: "color",
                            description: "set a color using hex values"
                        },
                        {
                            type: 3,
                            name: "image",
                            description: "set an image using imgur"
                        },
                        {
                            type: 3,
                            name: "footer",
                            description: "set a footer"
                        },
                        {
                            type: 5,
                            name: "timestamp",
                            description: "set a timestamp"
                        }
                    ]
                },
                {
                    type: 1,
                    name: "channel",
                    description: "set a welcome message channel",
                    options: [
                        {
                            type: 5,
                            name: "enabled",
                            description: "enable/disable welcome messages"
                        },
                        {
                            type: 7,
                            name: "text_channel",
                            description: "set a welcome channel",
                            channel_types: [0]
                        }
                    ]
                }
            ]
        },
        {
            type: 2,
            name: "role",
            description: "set a welcome role",
            options: [
                {
                    type: 1,
                    name: "add",
                    description: "provide a role to add",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "provide a role",
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "remove",
                    description: "provide a role to remove",
                    options: [
                        {
                            type: 8,
                            name: "role",
                            description: "provide a role",
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "roles",
                    description: "show set roles on welcome"
                }
            ]
        }
    ],

    async execute(client, interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        const welcomeMessage = await welcomeMessageSchema.findOne({
            guildId: interaction.guildId
        });

        if (subcommandGroup === "message") {
            if (subcommand === "embed") {
                const temp = {};

                const options = {
                    title: interaction.options.getString("title"),
                    description: interaction.options.getString("description"),
                    color: interaction.options.getString("color"),
                    image: interaction.options.getString("image"),
                    footer: interaction.options.getString("footer"),
                    timestamp: interaction.options.getBoolean("timestamp")
                };

                for (const opt in options) {
                    if (options[opt] !== null && options[opt] !== undefined) {
                        temp[opt] = options[opt];
                    }
                }

                if (!Object.keys(temp).length) {
                    await interaction.reply({
                        content: "cannot create/update embed, no options were provided",
                        ephemeral: true
                    });

                    return;
                }

                if (options.color && !client.isHex(options.color)) {
                    await interaction.reply({
                        content: "provided color must represent a hex value",
                        ephemeral: true
                    });

                    return;
                }

                if (
                    !options.description && !welcomeMessage?.embed?.description ||
                    !options.title && !welcomeMessage?.embed?.title
                ) {
                    await interaction.reply({
                        content: "u must provide a description or title",
                        ephemeral: true
                    });

                    return;
                }

                if (!welcomeMessage) {
                    const schema = await welcomeMessageSchema.create({
                        guildId: interaction.guildId,
                        isEnabled: true,
                        embed: { ...temp }
                    });

                    schema.save();

                    await interaction.reply("embed has been created");

                    return;
                }

                await welcomeMessageSchema.findOneAndUpdate(
                    { guildId: interaction.guildId },
                    { embed: { ...temp } }
                );

                await interaction.reply("embed has been updated");
            }

            if (subcommand === "channel") {
                if (!welcomeMessage) {
                    await interaction.reply("no setting available, missing embed");

                    return;
                }

                const temp = {};

                const channel = interaction.options.getChannel("text_channel");

                const options = {
                    channelId: channel?.id,
                    isEnabled: interaction.options.getBoolean("enabled")
                };

                for (const opt in options) {
                    if (options[opt] !== null && options[opt] !== undefined) {
                        temp[opt] = options[opt];
                    }
                }

                if (!options.channelId && options.isEnabled === null) {
                    await interaction.reply({
                        content: "no options were provided",
                        ephemeral: true
                    });

                    return;
                }

                await welcomeMessageSchema.findOneAndUpdate({
                    guildId: interaction.guildId
                }, temp);

                await interaction.reply("settings have been updated");
            }
        }

        if (subcommandGroup === "role") {
            if (subcommand === "add") {
                const role = interaction.options.getRole("role");

                const welcomeRole = await welcomeRoleSchema.findOne({
                    guildId: interaction.guildId,
                    roleId: role.id
                });

                if (welcomeRole) {
                    await interaction.reply({
                        content: `provided role \`${role.name}\` is already added`,
                        ephemeral: true
                    });

                    return;
                }

                await welcomeRoleSchema.create({
                    guildId: interaction.guildId,
                    roleId: role.id,
                });

                await interaction.reply(`added role \`${role.name}\` to welcome roles`);
            }

            if (subcommand === "remove") {
                const role = interaction.options.getRole("role");

                await welcomeRoleSchema.findOneAndDelete({
                    guildId: interaction.guildId,
                    roleId: role.id
                });

                await interaction.reply(`removed role \`${role.name}\` from welcome roles`);
            }

            if (subcommand === "roles") {
                const welcomeRoles = await welcomeRoleSchema.find({
                    guildId: interaction.guildId
                });

                if (!welcomeRoles.length) {
                    await interaction.reply("no welcome roles set");

                    return;
                }

                const roleNames = [];

                for (const { roleId } of welcomeRoles) {
                    const roleName = await interaction.member.guild.roles.cache.get(roleId);
                    roleNames.push(roleName);
                }

                const embed = new MessageEmbed()
                    .setTitle("welcome roles")
                    .setColor("#8b81a5")
                    .setDescription(roleNames.join(" "));

                await interaction.reply({
                    embeds: [embed]
                });
            }
        }
    }
};