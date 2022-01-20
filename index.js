require("dotenv").config();

const Hazel = require("./structures/hazel.js");
const client = new Hazel();

client.build();
