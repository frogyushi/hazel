const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        guildId: { type: String, required: true, unique: true },
        admin: { type: String },
        moderator: { type: String },
    }
);

const model = mongoose.model("permissionSchema", schema);

module.exports = model;