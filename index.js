const mongoose = require("mongoose");
const config = require("./config.json");
const Hazel = require("./base/Hazel");
const client = new Hazel();

client.loadCommands();
client.loadEvents();

mongoose.connect(config.mongodb.uri, { keepAlive: true }).then(() => console.log("connected to the database"));

client.login(config.token);