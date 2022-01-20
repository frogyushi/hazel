const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	guildId: { type: String, required: true },
	commandName: { type: String },
	roleId: { type: String },
	hasPermission: { type: Boolean },
});

const model = mongoose.model("permissionSchema", schema);

module.exports = model;
