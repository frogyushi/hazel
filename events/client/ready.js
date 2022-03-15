module.exports = {
	name: "ready",

	async execute(client) {
		client.user.setActivity("Valorant", { type: "COMPETING" });

		client.setSlashPerms();
		client.registerSlashCommands();

		client.logger.success("Client is ready");
	},
};
