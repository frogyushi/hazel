const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { Client, Intents, Collection } = require("discord.js");
const { sync } = require("glob");

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

        this.token = process.env.CLIENT_TOKEN;
        this.id = process.env.CLIENT_ID;
        this.guildId = process.env.GUILD_ID;
        this.mongoURI = process.env.MONGO_URI;
        this.global = process.env.GLOBAL_BOOL;

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
                youtubeCookie: process.env.COOKIES
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
        for (const guild of this.guilds.cache.values()) {
            const { commands, roles } = guild;
            const data = await commands.fetch();

            const fullPermissions = [];
            for (const { name, id } of data.values()) {
                const { permissions: perms } = this.commands.get(name);
                if (!perms) continue;

                const permissions = perms.map((perm) => {
                    const role = roles.cache.find((role) => role.name === perm)?.id;
                    if (role) return {
                        id: role,
                        type: 1,
                        permission: true
                    };
                });

                fullPermissions.push({ id, permissions });
            }

            await guild.commands.permissions.set({ fullPermissions });
        }
    }

    async registerSlashCommands() {
        const rest = new REST({ version: "9" }).setToken(this.token);

        if (this.global === "true") {
            const guild = this.guilds.cache.get(this.guildId);

            await rest.put(
                Routes.applicationCommands(this.id),
                {
                    body: this.slashCommands
                },
            );

            guild.commands.set([]);

            console.log("registered slash commands as global");
        } else {
            await rest.put(
                Routes.applicationGuildCommands(this.id, this.guildId),
                {
                    body: this.slashCommands
                }
            );

            console.log("registered slash commands as guild");
        }
    }

    getRandomArrayElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    };
}

module.exports = Hazel;
