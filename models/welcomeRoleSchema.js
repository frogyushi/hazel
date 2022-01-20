const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	guildId: { type: String, required: true },
	roleId: { type: String },
});

const model = mongoose.model("welcomeRoleSchema", schema);

module.exports = model;
