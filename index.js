require('dotenv').config();

const mongoose = require("mongoose");
const Hazel = require("./base/hazel");
const client = new Hazel();

client.loadCommands();
client.loadEvents();

mongoose.connect(client.mongoURI, { keepAlive: true }).then(() => console.log("connected to the database"));

client.login(client.token);