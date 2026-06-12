/*
 * STILL IN BUILD LOOK UGLY ASF
 */

// Import every dependency
const express = require("express");
const mongoose = require("mongoose");
const { newUser } = require("./models/userSchema");
const { isalnum, generateHash, generateJwt, validateJwt } = require("./utils");
const { jwt } = require("jsonwebtoken");

// Port used by our API
const PORT = 4444;
// URL of our mongodb database
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`;

// Initialized the webserver served by expressjs
const api = express();
const bcrypt = require("bcryptjs");

// Initialized connection to the database
mongoose
	.connect(url)
	.then(() => {
		console.log(`Connected to ${url}`);
	})
	.catch((error) => {
		console.log(error);
	});

// Specify to expressjs that we will get json syntax body
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.disable("x-powered-by");

/*
 * When stopping docker container, docker send SIGTERM
 * and then send a SIGKILL to stop the container
 */
process.on("SIGTERM", (code_signal_error) => {
	process.exit(0);
});

/* ----- GET REQUEST METHODE ----- */

/*
 * Endpoint to check from the client if the api is up
 * METHODE: GET
 */
api.get("/health", (req, ret) => {
	ret.send("API status : OK");
});

/*
 * Endpoint to retrieve the number of users currently register in the database
 * METHODE: GET
 */
api.get("/countUser", async (req, ret) => {
	let numberOfUser = await newUser.collection.count();
	ret.json({ users: numberOfUser });
});

/* ----- POST REQUEST METHODE ----- */

/*
 * Endpoint to register a user
 * METHODE: POST
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "username": "username of the user"
 *   "password": "password of the user"
 *   "email": "email of the user"
 * RETURN STATUS CODES:
 *  - 200 : Everything is fine
 *  - 451 : The password provided isnt valid
 */
api.post("/register", async (req, ret) => {
	// Get the content of the body of the request
	const data = req.body;

	// Check if the user have put an username, password, and email
	if (
		data.username === undefined ||
		data.password === undefined ||
		data.email === undefined
	)
		return ret.sendStatus(451);

	// Search in the database who have the same username and email than the user (partially work the 12/06)
	const exist = await newUser.findOne({
		$or: [{ email: { $eq: data.email } }, { username: { $eq: data.username } }],
	});

	console.log(exist);
	// If a user or a email is already associate with da account
	if (exist !== null)
		return ret.send(
			`Failed to create user ${String(data.username).substring(0, 20)}:${String(data.email).substring(0, 20)}`,
		);
	// Check if the password of the user is superior that 12 character
	if (
		(String(data.password).length <= 12 &&
			String(data.password).length > 128) ||
		isalnum(data.password) == false
	) {
		console.log(`${data.password} is invalid!`);
		return ret.sendStatus(451).send("invalid password");
	}

	const hashed_password = await generateHash(data.password);
	console.log(`hash = ${hashed_password}`);
	// Create the user on the db
	await newUser.create({
		username: data.username,
		email: data.email,
		password: hashed_password,
		history: [],
	});
	// Tell to our client that our user have been created by sending a status code 200
	return ret.json({ jwt: generateJwt(data) });
});

/*
 * Endpoint to log in a user
 * METHODE: POST
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "password": "password of the user"
 *   "email": "email of the user"
 * RETURN STATUS CODES:
 *  - 200 : Everything is fine
 *  - 404 : The email provided or the password isnt valid
 */
api.post("/login", async (res, ret) => {
	// Get the body of the request
	const data = res.body;
	const expiration = data.keepLog ? "1w" : "1h";

	// Check if the email and the password is here
	if (data.email === null || data.password === null) return ret.sendStatus(400);

	// Check if the user with the provided email exist
	const exist = await newUser.findOne({ email: { $eq: data.email } });
	if (exist === null) {
		// Send a 404
		return ret.sendStatus(404);
	}

	// Check if the hashed password in db and the provided password match
	const valid = await bcrypt.compare(data.password, exist.password);
	if (valid == true) {
		return ret.sendStatus(200);
	} else {
		return ret.sendStatus(404);
	}
});

// Start our API
api.listen(PORT, (err) => {
	if (!err) {
		console.log(
			`Listening on https://transcendence.42.fr/api or http://api:${PORT} in the docker network`,
		);
	}
});
