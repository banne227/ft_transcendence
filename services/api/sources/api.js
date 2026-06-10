<<<<<<< HEAD
// Initialized ExpressJS framework
const express = require("express");
// const mongoose = require('mongoose')
=======
// Initialized ExpressJS framework & mongoose lib (communicate with the db)
const express = require("express");
const mongoose = require("mongoose");
>>>>>>> 6fa8f97 (Found why websocket can't connect, i still need to find how to fix this.\n\tThe connection with the websocket is not trigger because nodejs (client test) required a valide CA certificate to work but our certificate is self-sign and cannot be a trust by any authorities)

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
api.get("/health", (req, res) => {
	res.send("API status : OK");
});

// Start to listening for connection
api.listen(PORT, () => {
	console.log(`Listening on http://api:${PORT}`);
});
