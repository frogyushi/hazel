const fg = require("fast-glob");
const mongoose = require("mongoose");
const permissionSchema = require("../models/permissionSchema");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { Client, Intents, Collection } = require("discord.js");

module.exports = class Hazel extends Client {
	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_VOICE_STATES,
			],
		});

		this.distube = new DisTube(this, {
			searchSongs: 1,
			searchCooldown: 30,
			leaveOnEmpty: true,
			emptyCooldown: 60,
			leaveOnFinish: false,
			leaveOnStop: false,
			plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true })],
			youtubeCookie: process.env.COOKIES,
		});

		this.commands = new Collection();
		this.temp = new Collection();
		this.slash = [];
	}

	async build() {
		this.login(process.env.CLIENT_TOKEN);
		this.loadCommands();
		this.loadEvents();
		this.loadEventsDistube();
		await mongoose.connect(process.env.MONGO_URI, { keepAlive: true });
	}

	async loadCommands() {
		const commands = await fg("./commands/**/*.js");
		commands.forEach((path) => {
			const command = require("." + path);
			if (command.ownerOnly) command.default_permission = false;
			if (command.name && command.execute) {
				this.slash.push(command);
				this.commands.set(command.name, command);
			}
		});
	}

	async loadEvents() {
		const client = await fg("./events/client/**/*.js");
		client.forEach((path) => {
			const { name, execute } = require("." + path);
			if (name && execute) {
				this.on(name, (...args) => execute(this, ...args));
			}
		});
	}

	async loadEventsDistube() {
		const events = await fg("./events/distube/**/*.js");
		events.forEach((path) => {
			const { name, execute } = require("." + path);
			if (name && execute) {
				this.distube.on(name, (...args) => execute(this, ...args));
			}
		});
	}

	async setSlashPermsGuild(guild) {
		const fullPermissions = [];
		const commands = await this.application.commands.fetch();
		for (const { id, name } of commands.values()) {
			const { ownerOnly = false } = await this.commands.get(name);
			const permissionSchemas = await permissionSchema.find({
				guildId: guild.id,
				commandName: name,
			});

			const permissions = ownerOnly
				? [
						{
							id: guild.ownerId,
							type: 2,
							permission: true,
						},
				  ]
				: [];

			if (permissionSchemas.length) {
				const perms = permissionSchemas.map(({ roleId, hasPermission }) => ({
					id: roleId,
					type: 1,
					permission: hasPermission,
				}));

				permissions.push(...perms);
			}

			fullPermissions.push({ id, permissions });
		}

		await this.guilds.cache.get(guild.id)?.commands.permissions.set({ fullPermissions });
	}

	async setSlashPerms() {
		this.guilds.cache.forEach((guild) => this.setSlashPermsGuild(guild));
	}

	async registerSlashCommands() {
		await this.application.commands.set(this.slash);
	}
};
