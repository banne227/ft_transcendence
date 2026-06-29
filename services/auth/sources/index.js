// Import every dependency
const express = require('express')
const mongoose = require('mongoose')
const {
	isalnum,
	generateHash,
	generateJwt,
	validateJwt,
	sanitizeUserInput,
	isnum,
	decodeJwt,
} = require('./utils.js')
const { jwt } = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// --- DEFINE CONSTANT ---
// Create the server
const auth = express()
// Assign the port where to listen
const PORT = 9999
// URL of our mongodb database
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`
// Import the user modele scheme
const { newUser } = require('./models/userSchema')

// Initialized connection with the database
mongoose
	.connect(url)
	.then(() => {
		console.log(`[+] Succesfully connected to ${url}`)
	})
	.catch((error) => {
		console.log(`[!] Error caught :`)
		console.log(error)
		process.exit(1)
	})

/*
 * When stopping docker container, docker send SIGTERM
 * to the container. This function is a special signal
 * handler when the container recieve a SIGTERM
 */
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

auth.get('/logout', (req, res) => {
	// Redirect the user to the hub page
	res.redirect('/')
})

auth.post('/register', async (req, res) => {
	// Get the content of the body of the request
	let { username, password, email } = req.body

	username = sanitizeUserInput(username)
	password = sanitizeUserInput(password)
	email = sanitizeUserInput(String(email).toLowerCase())
	// Check if the user have put an username, password, and email
	if (username === '' || password === '' || email === '')
		return res.status(400).json({ error: 'Invalid body' })

	// Check if the user already have a JWT
	if (req.headers.authorization !== undefined) {
		// Do a request to /jwt/validate to check if the JWT is valid
		const response = await fetch('http://api:4444/jwt/validate', {
			method: 'GET',
			headers: {
				authorization: `${req.headers.authorization}`,
			},
		})
		if (response.status === 200)
			return res.status(200).json({ error: 'Already logged' })
	}

	// Search in the database who have the same username and email than the user (partially work the 12/06)
	const alreadyExist = await newUser.findOne({
		$or: [{ email: { $eq: email } }, { username: { $eq: username } }],
	})

	// If a user or a email is already associate with da account
	if (alreadyExist !== null)
		return res.status(401).json({
			error: `The username ${String(username).substring(0, 20)} or the email ${String(email).substring(0, 20)} is already taken`,
		})

	// Generate a unique identifier
	let uuid
	while (1) {
		uuid = crypto.randomUUID()
		if ((await newUser.findOne({ uuid: uuid })) === null) break
	}
	// Create the user on the db
	await newUser.create({
		username: String(username),
		email: String(email),
		password: String(await generateHash(password)),
		uuid: String(uuid),
		history: [],
	})

	// Creating our JWT
	const jwt = generateJwt(email, uuid)
	// Putting the JWT in the cookie response for the client
	res.cookie('jwt', jwt)
	// Tell to our client that our user have been created by sending a status code 200
	return res.status(200).json({ jwt: jwt })
})

auth.post('/login', async (req, res) => {
	// Get the body of the request
	let { email, password } = req.body

	email = sanitizeUserInput(String(email).toLowerCase())
	password = sanitizeUserInput(password)

	// Check if the email and the password is here
	if (email === null || password === null)
		return res.status(400).json({ error: 'Invalid body data' })

	// Check if the user already have a JWT
	if (req.headers.authorization !== undefined)
		return res.status(409).json({ error: 'Already logged' })

	// Check if the user with the provided email exist
	const exist = await newUser.findOne({ email: { $eq: email } })
	if (exist === null) {
		return res.status(404).json({ error: `User ${email} not found` })
	}

	// Check if the hashed password in db and the provided password match
	const passwordIsValid = await bcrypt.compare(password, exist.password)

	if (passwordIsValid == true) {
		// Generate a new JWT for this session and put him on the cookies
		res.cookie('jwt', generateJwt(email, exist.uuid))
		return res.status(200).send(`Connection success!`)
	} else {
		// Sleep for 1000ms (1s) to prevent bruteforce attack to work
		await new Promise((r) => setTimeout(r, 1000))
		return res.status(401).send(`Invalid password`)
	}
})

auth.post('/forget', async (req, res) => {
	let { email, password } = req.body

	email = sanitizeUserInput(String(email).toLowerCase())
	password = sanitizeUserInput(password)
	// Check if the a email and a password is on the body
	if (email === undefined || password === undefined)
		return res.sendStatus(400)

	// Check if the password of the user is superior that 12 character
	if (
		(String(password).length <= 12 && String(password).length > 128) ||
		isalnum(password) == false
	) {
		return res.status(401).json({ error: 'invalid password' })
	}

	// Search on the database if the user exist
	let user = await newUser.findOne({ email: { $eq: email } })
	// If not exist
	if (!user)
		return res.status(401).json({ error: 'cannot edit the password' })
	// Update the password associate to the email on the database
	user = await newUser.updateOne(
		{ email: email },
		{ password: generateHash(password) },
	)
	res.cookie('jwt', generateJwt(user.username, email))
	return res.status(200).json({
		succes: 'The password have been succesfully changed',
	})
})

// Start listening on the port
try {
	auth.listen(PORT, () => {
		console.log(`[+] Auth endpoint listening on port ${PORT}`)
	})
} catch (error) {
	console.log(`[!] Error caught :`)
	console.log(error)
	process.exit(1)
}
