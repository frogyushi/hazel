const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        guildId: { type: String, required: true },
        command: { type: String },
        role: { type: String },
        permission: { type: Boolean }
    }
);

const model = mongoose.model("permissionSchema", schema);

module.exports = model;