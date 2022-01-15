module.exports = {
    name: "ready",

    async execute(client) {
        client.user.setActivity('Valorant', { type: 'COMPETING' });

        client.setSlashPermissionsGlobal();
        client.registerSlashCommands();
        client.loadDistubeEvents();

        console.log("client is ready");
    }
};