module.exports = {
	name: "error",

	async execute(client, channel, error) {
		this.logger.error(error);
	},
};
