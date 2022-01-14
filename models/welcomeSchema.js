const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        guildId: { type: String, required: true, unique: true },
        channelId: { type: String },
        enabled: { type: Boolean, required: true },
        color: { type: String },
        title: { type: String },
        description: { type: String },
        image: { type: String },
        footer: { type: String },
        timestamp: { type: Boolean, default: false },
    }
);

const model = mongoose.model("welcomeSchema", schema);

module.exports = model;