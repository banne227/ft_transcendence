// Initialized ExpressJS framework & mongoose lib (communicate with the db)
const express = require("express");
const mongoose = require("mongoose");

const db = {};
const api = express();
const PORT = 4444;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mangodb/databases`;

console.log(`${url}`);
mongoose
	.connect(url)
	.then(() => {
		res.send(`Connected to ${url}`);
	})
	.catch((error) => {
		console.log(error);
	});

/*
 * When stopping docker container, docker send SIGTERM
 * and then send a SIGKILL to stop the container
 */
process.on("SIGTERM", (code_signal_error) => {
	process.exit(0);
});

/*
 * Endpoint to check from the client if the api is up
 */
api.get("/health", (req, res) => {
	res.send("API status : OK");
});

api.get("/db", (req, res) => {
	res.send("1");
});

// Start to listening for connection
api.listen(PORT, () => {
	console.log(`Listening on http://api:${PORT}`);
});
