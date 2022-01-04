const mongoose = require("mongoose");
const Hazel = require("./base/Hazel");
const client = new Hazel();

require('dotenv').config();

client.loadCommands();
client.loadEvents();

mongoose.connect(client.MONGODB_URI, { keepAlive: true }).then(() => console.log("connected to the database"));

client.login(client.TOKEN);