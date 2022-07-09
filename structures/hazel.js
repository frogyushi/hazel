const fg = require("fast-glob");
const mongoose = require("mongoose");
const { Signale } = require("signale");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { Client, Intents, Collection } = require("discord.js");

class Hazel extends Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES,
            ],
        });

        this.color = process.env.COLOR;
        this.id = process.env.CLIENT_ID;

        this.commands = new Collection();
        this.temp = new Collection();
        this.slash = [];
        this.slashGuild = [];

        this.logger = new Signale({ scope: "hazel" });
        this.distube = new DisTube(this, {
            nsfw: false,
            searchSongs: 0,
            searchCooldown: 30,
            leaveOnEmpty: true,
            emptyCooldown: 60,
            leaveOnFinish: false,
            leaveOnStop: false,
            youtubeDL: true,
            updateYouTubeDL: true,
            youtubeCookie: process.env.COOKIES,
            plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true })],
            ytdlOptions: {
                highWaterMark: 1024 * 1024 * 64,
                quality: "highestaudio",
                format: "audioonly",
                liveBuffer: 60000,
                dlChunkSize: 1024 * 1024 * 4,
            },
        });
    }

    async build() {
        this.login(process.env.CLIENT_TOKEN);
        this.loadCommands();
        this.loadEvents();
        this.loadEventsDistube();

        await mongoose
            .connect(process.env.MONGO_URI, { keepAlive: true })
            .then(() => this.logger.success("Connected to database"))
            .catch(() => this.logger.error("Couldn't connect to database"));
    }

    async loadCommands() {
        for (const path of await fg("./commands/**/*.js")) {
            const command = require(`.${path}`);
            if (command.ownerOnly) command.default_permission = false;
            if (command.name && command.execute) {
                command.guildOnly ? this.slashGuild.push(command) : this.slash.push(command);
                this.commands.set(command.name, command);
            }
        }
    }

    async loadEvents() {
        for (const path of await fg("./events/client/**/*.js")) {
            const { name, execute } = require(`.${path}`);
            if (name && execute) this.on(name, (...args) => execute(this, ...args));
        }
    }

    async loadEventsDistube() {
        for (const path of await fg("./events/distube/**/*.js")) {
            const { name, execute } = require(`.${path}`);
            if (name && execute) this.distube.on(name, (...args) => execute(this, ...args));
        }
    }

    async registerSlashCommands() {
        await this.application.commands.set(this.slash);
        this.logger.success("Loaded global commands");
        if (process.env.GUILD_ID) {
            await this.application.commands.set(this.slashGuild, process.env.GUILD_ID);
            this.logger.success("Loaded guild commands");
        }
    }

    getRandomArrayElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    isHexColor(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }
}

module.exports = Hazel;
