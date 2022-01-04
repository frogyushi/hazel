const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        guildId: { type: String, required: true },
        userTag: { type: String, required: true },
        messages: { type: Number, default: 0 }
    }
);

const model = mongoose.model("memberSchema", schema);

module.exports = model;