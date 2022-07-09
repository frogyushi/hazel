const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleName: { type: String },
    roleId: { type: String },
    emojiId: { type: String },
});

const model = mongoose.model("colorRolesSchemas", schema);

module.exports = model;
