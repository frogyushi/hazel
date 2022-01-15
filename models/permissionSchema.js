const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        guildId: { type: String, required: true },
        command: { type: String },
        role: { type: String },
        enabled: { type: Boolean }
    }
);

const model = mongoose.model("permissionSchema", schema);

module.exports = model;