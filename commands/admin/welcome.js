const welcomeMessageSchema = require("../../models/welcomeMessageSchema");
const welcomeRoleSchema = require("../../models/welcomeRoleSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "welcome",
	description: "Set up a welcome message when a user is invited to this server",
	ownerOnly: true,
	options: [
		{
			type: 2,
			name: "message",
			description: "Set up a welcome message",
			options: [
				{
					type: 1,
					name: "embed",
					description: "Create/update embed",
					options: [
						{
							type: 3,
							name: "title",
							description: "Title",
						},
						{
							type: 3,
							name: "description",
							description: "Description",
						},
						{
							type: 3,
							name: "color",
							description: "Provide a hex value",
						},
						{
							type: 3,
							name: "image",
							description: "Provide an Imgur URL",
						},
						{
							type: 3,
							name: "footer",
							description: "Footer",
						},
						{
							type: 5,
							name: "timestamp",
							description: "Timestamp",
						},
					],
				},
				{
					type: 1,
					name: "channel",
					description: "Provide a channel where welcome messages are sent",
					options: [
						{
							type: 7,
							name: "text_channel",
							description: "Provide a text channel",
							channel_types: [0],
						},
						{
							type: 5,
							name: "enabled",
							description: "Enable/disable welcome messages",
						},
					],
				},
			],
		},
		{
			type: 2,
			name: "role",
			description: "Set up roles to be added to invited users alongside welcome messages",
			options: [
				{
					type: 1,
					name: "add",
					description: "Provide a role to be listed",
					options: [
						{
							type: 8,
							name: "role",
							description: "Provide a role",
							required: true,
						},
					],
				},
				{
					type: 1,
					name: "remove",
					description: "Provide a role to removed from the list",
					options: [
						{
							type: 8,
							name: "role",
							description: "Provide a role",
							required: true,
						},
					],
				},
				{
					type: 1,
					name: "roles",
					description: "Display configured welcome roles",
				},
			],
		},
	],

	async execute(client, interaction) {
		const subcommandGroup = interaction.options.getSubcommandGroup();
		const subcommand = interaction.options.getSubcommand();

		const welcomeMessage = await welcomeMessageSchema.findOne({
			guildId: interaction.guildId,
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
					timestamp: interaction.options.getBoolean("timestamp"),
				};

				for (const opt in options) {
					if (options[opt] !== null && options[opt] !== undefined) {
						temp[opt] = options[opt];
					}
				}

				if (!Object.keys(temp).length) {
					await interaction.reply({
						content: "Cannot create/update embed since no options were provided",
						ephemeral: true,
					});

					return;
				}

				if (options.color && !client.isHexColor(options.color)) {
					await interaction.reply({
						content: "Provided color must represent a hex value",
						ephemeral: true,
					});

					return;
				}

				if (
					(!options.description && !welcomeMessage?.description) ||
					(!options.title && !welcomeMessage?.title)
				) {
					await interaction.reply({
						content: "There must be at least one description or title inside the welcome message embed",
						ephemeral: true,
					});

					return;
				}

				if (!welcomeMessage) {
					const schema = await welcomeMessageSchema.create({
						guildId: interaction.guildId,
						isEnabled: true,
						temp,
					});

					schema.save();

					await interaction.reply("Welcome message embed has been created");

					return;
				}

				await welcomeMessageSchema.findOneAndUpdate({ guildId: interaction.guildId }, temp);

				await interaction.reply("Welcome message embed has been updated");
			}

			if (subcommand === "channel") {
				if (!welcomeMessage) {
					await interaction.reply(
						"This command is not available since no welcome message embed has been set"
					);

					return;
				}

				const temp = {};

				const channel = interaction.options.getChannel("text_channel");

				const options = {
					channelId: channel?.id,
					isEnabled: interaction.options.getBoolean("enabled"),
				};

				for (const opt in options) {
					if (options[opt] !== null && options[opt] !== undefined) {
						temp[opt] = options[opt];
					}
				}

				if (!options.channelId && options.isEnabled === null) {
					await interaction.reply({
						content: "No options were provided",
						ephemeral: true,
					});

					return;
				}

				await welcomeMessageSchema.findOneAndUpdate({ guildId: interaction.guildId }, temp);

				await interaction.reply("Welcome message channel have been updated");
			}
		}

		if (subcommandGroup === "role") {
			if (subcommand === "add") {
				const role = interaction.options.getRole("role");

				const welcomeRole = await welcomeRoleSchema.findOne({
					guildId: interaction.guildId,
					roleId: role.id,
				});

				if (welcomeRole) {
					await interaction.reply({
						content: `Role \`${role.name}\` is already set as a welcome role`,
						ephemeral: true,
					});

					return;
				}

				await welcomeRoleSchema.create({
					guildId: interaction.guildId,
					roleId: role.id,
				});

				await interaction.reply(`Added role \`${role.name}\` to welcome roles`);
			}

			if (subcommand === "remove") {
				const role = interaction.options.getRole("role");

				await welcomeRoleSchema.findOneAndDelete({
					guildId: interaction.guildId,
					roleId: role.id,
				});

				await interaction.reply(`Removed role \`${role.name}\` from welcome roles`);
			}

			if (subcommand === "roles") {
				const welcomeRoles = await welcomeRoleSchema.find({
					guildId: interaction.guildId,
				});

				const roleNames = welcomeRoles.length
					? welcomeRoles.map(async ({ roleId }) => {
							return await interaction.member.guild.roles.cache.get(roleId).then(({ name }) => name);
					  })
					: [];

				const embed = new MessageEmbed()
					.setTitle("List of welcome roles")
					.setColor(client.color)
					.setDescription(
						roleNames.length
							? roleNames.join(", ")
							: "No roles found. Use **/welcome roles add** to add a welcome role"
					);

				await interaction.reply({
					embeds: [embed],
				});
			}
		}
	},
};
