const { sync } = require("glob");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { Client, Intents, Collection } = require("discord.js");
const permissionSchema = require("../models/permissionSchema");

class Hazel extends Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });

        this.token = process.env.CLIENT_TOKEN;
        this.id = process.env.CLIENT_ID;
        this.guildId = process.env.GUILD_ID;
        this.mongoURI = process.env.MONGO_URI;

        this.REST = new REST({ version: "9" }).setToken(this.token);

        this.distube = new DisTube(this, {
            searchSongs: 1,
            searchCooldown: 30,
            leaveOnEmpty: true,
            emptyCooldown: 60,
            leaveOnFinish: false,
            leaveOnStop: false,
            plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true })],
            youtubeCookie: process.env.COOKIES
        });

        this.globalCommands = [];
        this.guildCommands = [];
        this.commands = new Collection();
        this.temporaryVoiceChannels = new Collection();
    }

    loadCommands() {
        for (const file of sync("./commands/**/*.js")) {
            const command = require(`.${file}`);
            if (command.ownerOnly) command.default_permission = false;
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

    async setSlashPermissionsGuild(guild) {
        const fullPermissions = [];
        const commands = await this.application.commands.fetch();

        for (const { id, name } of commands.values()) {
            const permissionSchemas = await permissionSchema.find({ guildId: guild.id, commandName: name });
            const { ownerOnly = false } = await this.commands.get(name);

            const permissions = ownerOnly ? [{
                id: guild.ownerId,
                type: 2,
                permission: true
            }] : [];

            if (permissionSchemas.length) {
                const perms = permissionSchemas.map(({ roleId, hasPermission }) => ({
                    id: roleId,
                    type: 1,
                    permission: hasPermission
                }));

                permissions.push(...perms);
            }

            fullPermissions.push({ id, permissions });
        }

        await this.REST.put(
            Routes.guildApplicationCommandsPermissions(this.id, guild.id),
            { body: fullPermissions },
        );
    }

    async setSlashPermissionsGlobal() {
        this.guilds.cache.forEach((guild) => this.setSlashPermissionsGuild(guild));
        console.log("registered permissions");
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

    isHex(string) {
        return /^#[0-9A-F]{6}$/i.test(string);
    }
}

module.exports = Hazel;
