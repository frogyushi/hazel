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

        this.REST = new REST({ version: "9" }).setToken(this.token);

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
        const commands = await this.application.commands.fetch();

        for (const { roles, id } of this.guilds.cache.values()) {
            const fullPermissions = [];
            for (const command of commands.values()) {
                const { permissions: perms } = await this.commands.get(command.name);

                if (!perms) continue;

                let permissions = [];
                for (const perm of perms) {
                    const role = roles.cache.find((role) => role.name === perm)?.id || roles.cache.get(perm);
                    if (!role) continue;
                    permissions.push(
                        {
                            id: role,
                            type: 1,
                            permission: true
                        }
                    );

                    fullPermissions.push({ id: command.id, permissions });
                }
            }

            await this.REST.put(
                Routes.guildApplicationCommandsPermissions(this.id, id),
                {
                    body: fullPermissions
                },
            );
        }
    }

    async registerSlashCommands() {
        if (this.global === "true") {
            await this.REST.put(
                Routes.applicationCommands(this.id),
                {
                    body: this.slashCommands
                },
            );

            console.log("registered slash commands as global");
        } else {
            await this.REST.put(
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
