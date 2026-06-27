// Import every dependency
const express = require("express");
const mongoose = require("mongoose");
const {
	isalnum,
	generateHash,
	generateJwt,
	validateJwt,
	sanitizeUserInput,
	isnum,
	decodeJwt,
} = require("./utils");
const { jwt } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import mongoose models
const { newUser } = require("./models/userSchema");

// Port used by our API
const PORT = 4444;
// URL of our mongodb database
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`;

// Create the webserver with ExpressJS
const api = express();

// Initialized connection to the database
mongoose
	.connect(url)
	.then(() => {
		console.log(`Connected to ${url}`);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});

// Specify to expressjs that we will get json syntax body
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.disable("x-powered-by");

/*
 * When stopping docker container, docker send SIGTERM
 * to the container. This function is a special signal
 * handler when the container recieve a SIGTERM
 */
process.on("SIGTERM", (code_signal_error) => {
	process.exit(0);
});

/* ----- GET REQUEST METHODE ----- */
api.get("/health", (req, res) => {
	res.status(200).json({ status: "API status : OK" });
});

api.get("/countUser", async (req, res) => {
	let numberOfUser = await newUser.collection.count();
	res.status(200).json({ users: numberOfUser });
});

api.get("/logout", (req, res) => {
	// Redirect the user to the hub page
	res.redirect("/");
});

api.get("/", (req, res) => {
	// Redirect the user to the API documentation
	res
		.status(301)
		.redirect(
			"https://github.com/banne227/ft_transcendence/blob/main/docs/API.md",
		);
});

api.get("/history/:userName", async (req, res) => {
	// Get the username specified in uri parameter
	const username = sanitizeUserInput(req.params.userName);
	// Searching for the user on the db
	const data = await newUser
		.findOne({ username: { $eq: username } }, "-history._id")
		.lean();
	// if the user doesnt exist
	if (data === null)
		return res
			.status(404)
			.json({ error: { message: `cannot find ${username}`, code: 404 } });
	// if the user exist but it doesnt played a single match
	if (data.history == "[]")
		return res.status(404).json({ error: `${username} didnt have played yet` });
	// Send the history in a json format
	return res.status(200).json(data.history);
});

api.get("/user/:user/getcolor", async (req, res) => {
	const username = sanitizeUserInput(req.params.user);
	if (username === "")
		return res.status(400).json({ error: "Invalid username" });
	const data = await newUser.findOne({ username: { $eq: username } }).lean();
	if (data === null)
		return res.status(404).json({ error: `cannot find ${username}` });
	return res.status(200).json({ color: data.color });
});

/* ----- POST REQUEST METHODE ----- */
api.post("/register", async (req, res) => {
	// Get the content of the body of the request
	let { username, password, email } = req.body;

	// Check if the user already have a JWT
	if (req.headers.authorization !== undefined) {
		// Do a request to /jwt/validate to check if the JWT is valid
		const response = await fetch("http://api:4444/jwt/validate", {
			method: "GET",
			headers: {
				authorization: `${req.headers.authorization}`,
			},
		});
		if (response.status === 200)
			return res.status(200).json({ error: "Already logged" });
	}

	// Check if the user have put an username, password, and email
	try {
		if (username === "") throw "Missing username";
		if (password === "") throw "Missing password";
		if (email === "") throw "Missing email";
	} catch (err) {
		return res.status(400).json({ error: `${err}` });
	}

	// Sanitized user input
	username = sanitizeUserInput(username);
	password = sanitizeUserInput(password);
	email = sanitizeUserInput(String(email).toLowerCase());

	// use a regex to check if the email is on a right format
	if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
		return res.status(401).json({ error: "invalid email" });

	// Search in the database who have the same username and email than the user (partially work the 12/06)
	const alreadyExist = await newUser.findOne({
		$or: [{ email: { $eq: email } }, { username: { $eq: username } }],
	});

	// If a user or a email is already associate with da account
	if (alreadyExist !== null)
		return res.status(401).json({
			error: `The username ${String(username).substring(0, 20)} or the email ${String(email).substring(0, 20)} is already taken`,
		});

	// Generate a unique identifier
	let uuid;
	while (1) {
		uuid = crypto.randomUUID();
		if ((await newUser.findOne({ uuid: uuid })) === null) break;
	}
	// Create the user on the db
	await newUser.create({
		username: `${String(username)}`,
		email: `${String(email)}`,
		password: `${String(await generateHash(password))}`,
		uuid: `${String(uuid)}`,
		history: [],
	});

	// Build the url parameter
	const param = new URLSearchParams();
	param.append("email", `${email}`);
	param.append("uuid", `${uuid}`);

	// Fetch /jwt/generate internal endpoint to a new jwt
	await fetch(`http://internal:1111/jwt/generate?${param}`, {
		method: "GET",
	})
		.then((response) => response.json()) // Convert the request data in json
		.then((data) => {
			res.cookie("jwt", data.jwt);
			return res
				.status(200)
				.json({ Succes: `The user ${username} have been created` });
		})
		.catch(console.error());
});

api.post("/login", async (req, res) => {
	// Get the body of the request
	let { email, password } = req.body;

	// Check if the email and the password is here
	if (email === null || password === null)
		return res.status(400).json({ error: "Invalid body data" });

	email = sanitizeUserInput(String(email).toLowerCase());
	password = sanitizeUserInput(password);

	// Check if the user already have a JWT
	if (req.headers.authorization !== undefined)
		return res.status(409).json({ error: "Already logged" });

	if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
		return res.status(401).json({ error: "invalid email" });

	// Check if the user with the provided email exist
	const exist = await newUser.findOne({ email: { $eq: email } });
	if (exist === null) {
		return res.status(404).json({ error: `User ${email} not found` });
	}

	// Check if the hashed password in db and the provided password match
	const passwordIsValid = await bcrypt.compare(password, exist.password);

	if (passwordIsValid == true) {
		// Build the url parameter
		const param = new URLSearchParams();
		param.append("email", `${email}`);
		param.append("uuid", `${exist.uuid}`);

		// Generate a new JWT for this session and put him on the cookies
		await fetch(`http://internal:1111/jwt/generate?${param}`, {
			method: "GET",
		})
			.then((response) => response.json()) // Convert the request data in json
			.then((data) => {
				res.cookie("jwt", data.jwt);
				return res.status(200).json({ Succes: `Logged as ${exist.username}` });
			})
			.catch(console.error());
	} else {
		// Sleep for 1000ms (1s) to prevent bruteforce attack to work
		await new Promise((r) => setTimeout(r, 1000));
		return res
			.status(401)
			.json({ error: { message: "Invalid password", code: 401 } });
	}
});

api.post("/forget", async (req, res) => {
	let { email, password } = req.body;

	email = sanitizeUserInput(String(email).toLowerCase());
	password = sanitizeUserInput(password);
	// Check if the a email and a password is on the body
	if (email === "" || password === "") return res.sendStatus(400);

	if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
		return res.status(401).json({ error: "invalid email" });

	// Check if the password of the user is superior that 12 character
	if (
		(String(password).length <= 12 && String(password).length > 128) ||
		isalnum(password) == false
	) {
		return res.status(401).json({ error: "invalid password" });
	}

	// Search on the database if the user exist
	let user = await newUser.findOne({ email: { $eq: email } });
	// If not exist
	if (!user) return res.status(401).json({ error: "cannot edit the password" });
	// Update the password associate to the email on the database
	user = await newUser.updateOne(
		{ email: email },
		{ password: generateHash(password) },
	);
	res.cookie("jwt", generateJwt(user.username, email));
	return res.status(200).json({
		succes: "The password have been succesfully changed",
	});
});

api.post("/addScore", async (req, res) => {
	let { score, username } = req.body;

	// Check if the body contain a username and a score
	if (username === undefined || score === undefined)
		return res.status(400).json({ error: "Missing body content" });

	score = sanitizeUserInput(score);
	username = sanitizeUserInput(username);

	// Check if the score is valid
	if (isNaN(Number(score))) {
		return res.status(400).json({ error: "Bad score type" });
	}

	// Get the current date
	const timestamp = new Date();

	// Pushing our new score into the history array
	await newUser
		.updateOne(
			{ username: username },
			{
				$push: {
					history: [
						{
							date: `${timestamp.toISOString()}`,
							scores: Number(score),
						},
					],
				},
			},
		)
		.catch((err) => {
			console.log("catch");
		});
	return res.status(200).json({
		succes: `Added ${username}:${score}`,
	});
});

api.get("/logged", async (req, res) => {
	// Take the jwt from the request
	const token = req.authorization;
	res.status(404).json({ error: "No finish yettt" });
});

api.put("/changecolor", async (req, res) => {
	// Get the JWT from the header
	const jwt = req.headers.authorization;
	// Get the skin from the body of the request
	const skinColor = req.body.color;

	// Check if we have the jwt and the skin color
	if (skinColor === undefined) res.status(400).json({ error: "Missing color" });
	// Check if the skin color composed by number
	// if (skinColor.match("^#([A-Fa-f0-9]6|[A-Fa-f0-9]3)$") == false)
	// res.status(400).json({ error: 'Invalid skinColor' })
	// Decode the payload of the JWT and put his content to JSON
	if (jwt !== undefined) {
		const jwtPayload = JSON.parse(decodeJwt(jwt));
		// Search on the database if we got an account with this email and this uuid
		let user = await newUser.findOne({
			$and: [{ email: jwtPayload.email }, { uuid: jwtPayload.uuid }],
		});
		// If we found nothing
		if (user === null)
			return res.status(404).json({
				error: `Provided account information invalid`,
			});
		// Update the database with the new skin
		try {
			user = await newUser.updateOne(
				{
					$and: [{ email: jwtPayload.email }, { uuid: jwtPayload.uuid }],
				},
				{ colors: skinColor },
			);
		} catch (err) {
			console.log(err);
			return res
				.status(404)
				.json({ succes: `Changed the skin to color: ${skinColor}` });
		}
		return res
			.status(200)
			.json({ succes: `Changed the skin to color: ${skinColor}` });
	}
});

/* ----- DELETE REQUEST METHODE ----- */
api.delete("/delete", async (req, res) => {
	// Take the JWT from the authorization section in the header
	const token = req.headers.authorization;
	// Take the email from the body
	const email = sanitizeUserInput(String(req.body.email).toLowerCase());

	// If the email wasnt set
	if (email === undefined) {
		res.status(400).json({ error: "Email not provided" });
	}
	try {
		// Try to delete the account
		await newUser
			.find({ email: { $eq: email } })
			.deleteOne()
			.exec();
	} catch (err) {
		// In case of error
		res.status(301).json({ error: `Cant delete account ${err}` });
	}
	// In case of succes
	res.status(200).json({ succes: `Deleted ${email} account` });
});

api.get("/debug/db", async (req, res) => {
	const rrr = await newUser.find();

	res.status(200).json(rrr);
});

// Start our API
api.listen(PORT, (err) => {
	if (!err) {
		console.log(
			`Listening on https://transcendence.42.fr/api or http://api:${PORT} in the docker network`,
		);
	}
});
