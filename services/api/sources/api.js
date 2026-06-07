import { createServer } from "node:net";

// Define the IP and PORT to use
const IP = "127.0.0.1";
const PORT = process.env("PORT");

// Check if the PORT is on the environment variable
if (typeof PORT === "undefined") {
	console.log("FAILURE: The environment variable 'PORT' in undefined");
}

const SERVER = createServer();

SERVER.on();
