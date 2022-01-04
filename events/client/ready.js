module.exports = {
    name: "ready",

    async execute(client) {
        client.user.setActivity('Valorant', { type: 'COMPETING' });

        client.setSlashPermissions();
        client.registerSlashCommands();
        client.loadDistubeEvents();

        console.log("client is ready");
    }
};