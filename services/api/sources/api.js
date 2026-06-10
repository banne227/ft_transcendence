// Initialized ExpressJS framework
const express = require("express");
// const mongoose = require('mongoose')

const db = {};
const api = express();
const PORT = 444;

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
api.get("/api/health", (req, res) => {
	res.send("API status : OK");
});

// Start to listening for connection
try {
	api.listen(PORT, () => {
		console.log(`Listening on http://api:${PORT}`);
	});
} catch (err) {
	console.log(`Failed to listen on http://api:${PORT}`);
}
