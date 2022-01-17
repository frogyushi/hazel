const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        guildId: { type: String, required: true, unique: true },
        channel: { type: String },
        channelId: { type: String },
        enabled: { type: Boolean, default: false }
    }
);

const model = mongoose.model("joinToCreateSchema", schema);

module.exports = model;