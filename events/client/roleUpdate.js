module.exports = {
    name: "roleUpdate",

    async execute(client) {
        await client.REST.put(
            Routes.guildApplicationCommandsPermissions(this.id, id),
            {
                body: fullPermissions
            },
        );
    }
};