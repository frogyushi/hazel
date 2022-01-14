const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        guildId: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        userTag: { type: String, required: true },
        messages: { type: Number, default: 0 }
    }
);

const model = mongoose.model("memberSchema", schema);

module.exports = model;