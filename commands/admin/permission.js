const permissionSchema = require("../../models/permissionSchema");

module.exports = {
	name: "permission",
	description: "Enable/disable command usage for a given role",
	ownerOnly: true,
	options: [
		{
			name: "command_name",
			description: "Provide a command name",
			type: 3,
			required: true,
		},
		{
			type: 8,
			name: "role",
			description: "Provide a role",
			required: true,
		},
		{
			type: 5,
			name: "permission",
			description: "Enable/disable permission to use command",
			required: true,
		},
	],

	async execute(client, interaction) {
		const options = {
			commandName: interaction.options.getString("command_name"),
			roleId: interaction.options.getRole("role").id,
			hasPermission: interaction.options.getBoolean("permission"),
		};

		const command = await client.commands.get(options.commandName);

		if (!command) {
			await interaction.reply({
				content: "Command with provided command name does not exist",
				ephemeral: true,
			});

			return;
		}

		await permissionSchema.findOneAndUpdate(
			{
				guildId: interaction.guildId,
				commandName: options.commandName,
				roleId: options.roleId,
			},
			{ hasPermission: options.hasPermission },
			{
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
			}
		);

		await interaction.reply(
			`Role's permission for command usage is set to \`${options.hasPermission}\` for command \`${options.commandName}\``
		);

		client.setSlashPermissionsGuild(interaction.guild);
	},
};
