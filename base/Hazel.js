const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { Client, Intents, Collection } = require("discord.js");
const { sync } = require("glob");

const config = require("../config.json");

class Hazel extends Client {
    constructor() {
        super(
            {
                intents: [
                    Intents.FLAGS.GUILDS,
                    Intents.FLAGS.GUILD_MESSAGES,
                    Intents.FLAGS.GUILD_MEMBERS,
                    Intents.FLAGS.GUILD_VOICE_STATES
                ]
            }
        );

        this.distube = new DisTube(
            this,
            {
                searchSongs: 1,
                searchCooldown: 30,
                leaveOnEmpty: true,
                emptyCooldown: 60,
                leaveOnFinish: false,
                leaveOnStop: false,
                plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true })],
                youtubeCookie: config.distube.cookies
            }
        );

        this.slashCommands = [];
        this.commands = new Collection();
        this.temporaryVoiceChannels = new Collection();
    }

    loadCommands() {
        for (const file of sync("./commands/**/*.js")) {
            const command = require(`.${file}`);
            if (command.permissions) command.default_permission = false;
            this.slashCommands.push(command);
            this.commands.set(command.name, command);
        }
    }

    loadEvents() {
        for (const file of sync("./events/client/**/*.js")) {
            const { name, execute } = require(`.${file}`);
            this.on(name, (...args) => execute(this, ...args));
        }
    }

    loadDistubeEvents() {
        for (const file of sync("./events/music/**/*.js")) {
            const { name, execute } = require(`.${file}`);
            this.distube.on(name, (...args) => execute(this, ...args));
        }
    }

    async setSlashPermissions() {
        const { commands, roles } = this.guilds.cache.get(config.guildId);
        const data = await commands.fetch();

        const fullPermissions = [];

        for (const { name, id } of data.values()) {
            const { permissions: perms } = this.commands.get(name);

            if (!perms) continue;

            const permissions = perms.map((perm) => {
                const role = roles.cache.find(({ name }) => name === perm).id;

                if (!role) return {
                    id: role,
                    type: 1,
                    permission: true
                };

                return {
                    id: perm,
                    type: 2,
                    permission: true
                };
            });

            fullPermissions.push({ id, permissions });
        }

        commands.permissions.set({ fullPermissions });
    }

    async registerSlashCommands() {
        const rest = new REST({ version: "9" }).setToken(config.token);

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            {
                body: this.slashCommands
            }
        );
    }
}

module.exports = Hazel;