const { sync } = require("glob");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { Client, Intents, Collection } = require("discord.js");
const permissionSchema = require("../models/permissionSchema");

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

        this.distube = new DisTube(this,
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

        this.globalCommands = [];
        this.guildCommands = [];
        this.commands = new Collection();
        this.temporaryVoiceChannels = new Collection();
    }

    loadCommands() {
        for (const file of sync("./commands/**/*.js")) {
            const command = require(`.${file}`);
            if (command.permissions) command.default_permission = false;
            this[command.guildOnly ? "guildCommands" : "globalCommands"].push(command);
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

        for (const guild of this.guilds.cache.values()) {

            const fullPermissions = [];
            for (const { id, name } of commands.values()) {
                const { permissions: perms } = await this.commands.get(name);

                if (!perms) continue;

                let permissions = [];
                for (const perm of perms) {
                    const schema = await permissionSchema.findOne({ guildId: guild.id });

                    if (perm === "owner") {
                        permissions.push(
                            {
                                id: guild.ownerId,
                                type: 2,
                                permission: true
                            }
                        );
                    } else if (perm === "admin") {
                        permissions.push(
                            {
                                id: schema.admin,
                                type: 1,
                                permission: true
                            }
                        );
                    } else if (perm === "moderator") {
                        permissions.push(
                            {
                                id: schema.moderator,
                                type: 1,
                                permission: true
                            }
                        );
                    }
                }

                console.log({ id, permissions });

                fullPermissions.push({ id, permissions });
            }

            console.log(fullPermissions);

            await this.REST.put(
                Routes.guildApplicationCommandsPermissions(this.id, id),
                { body: fullPermissions },
            );
        }
    }

    async registerSlashCommands() {
        await this.REST.put(
            Routes.applicationCommands(this.id),
            { body: this.globalCommands },
        );

        await this.REST.put(
            Routes.applicationGuildCommands(this.id, this.guildId),
            { body: this.guildCommands }
        );

        console.log("registered slash commands");
    }

    getRandomArrayElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    };

    isHexColor(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }
}

module.exports = Hazel;
