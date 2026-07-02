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

const { callGenerateJWT, callDecodeJWT, callValidateJWT } = require('./jwt.js')
const bcrypt = require('bcryptjs')

const auth = express() // Create the server
const PORT = 9999 // Assign the port where to listen
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases` // URL of our mongodb database
const { newUser } = require('./models/userSchema') // Import the user modele scheme

auth.use(express.json()) // Parse the body in json
auth.use(express.urlencoded({ extended: true }))
auth.disable('x-powered-by')

// Initialized connection with the database
mongoose
	.connect(url)
	.then(() => {
		console.log(`[+] Succesfully connected to ${url}`)
	})
	.catch((error) => {
		console.log(`[!] Cant connect to the database !`)
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

auth.get('/health', (_req, res) => {
	res.status(200).json({
		status: 'UP',
	})
})

auth.get('/logout', (req, res) => {
	// Redirect the user to the hub page
	res.redirect('/')
})

auth.post('/register', async (req, res) => {
	// Get the content of the body of the request
	let { username, password, email } = req.body

	// Check if the  username, password, and email is on the body
	try {
		if (String(username) == '' || username === undefined)
			throw 'Missing username'
		if (String(password) == '' || password === undefined)
			throw 'Missing password'
		if (String(email) == '' || email === undefined) throw 'Missing email'
	} catch (err) {
		return res.status(400).json({ error: `${err}` })
	}

	const userData = {}
	userData.username = sanitizeUserInput(String(username))
	userData.password = sanitizeUserInput(String(password))
	userData.email = sanitizeUserInput(String(email).toLowerCase())

	if (userData.password.length > 128) {
		return res.status(400).json({ error: 'The password is too long' })
	} else if (userData.password.length < 8) {
		return res.status(400).json({ error: 'The password is too short' })
	}
	if (req.headers.authorization !== undefined) {
		// Check if the user already have a JWT
		// Do a request to /jwt/validate to check if the JWT is valid
		const response = await fetch('http://internal:1111/jwt/validate', {
			method: 'GET',
			headers: {
				authorization: `${req.headers.authorization}`,
			},
		})
		if (response.status === 200)
			return res.status(409).json({ error: 'Already logged' })
	}

	// Search in the database who have the same username and email than the user (partially work the 12/06)
	const alreadyExist = await newUser.findOne({
		$or: [
			{ email: { $eq: userData.email } },
			{ username: { $eq: userData.username } },
		],
	})
	// If a user or a email is already associate with da account
	if (alreadyExist !== null)
		return res.status(401).json({
			error: `The username ${String(userData.username).substring(0, 128)} or the email ${String(userData.email).substring(0, 128)} is already taken`,
		})

	// Generate a unique identifier
	let uuid
	while (1) {
		uuid = String(crypto.randomUUID())
		if ((await newUser.findOne({ uuid: uuid })) === null) break
	}
	// Create the user on the db
	await newUser.create({
		username: userData.username,
		email: userData.email,
		password: String(await generateHash(userData.password)),
		uuid: uuid,
		history: [],
	})

	// Creating our JWT
	callGenerateJWT(userData.username, userData.email, uuid)
		.then((jwt) => {
			res.cookie('jwt', jwt) // Putting our JWT on the cookie of the response
			return res.status(200).json({
				succes: `User ${userData.username} have been created !`,
			}) // Everything work well
		})
		.catch((err) => {
			return res.status(500).json({ error: `${err}` })
		})
})

auth.post('/login', async (req, res) => {
	// Get the body of the request
	let { email, password } = req.body

	// Check if the  username, password, and email is on the body
	try {
		if (String(email) == '' || email === undefined) throw 'Missing email'
		if (String(password) == '' || password === undefined)
			throw 'Missing password'
	} catch (err) {
		return res.status(400).json({ error: `${err}` })
	}

	try {
		email = sanitizeUserInput(String(email).toLowerCase())
		password = sanitizeUserInput(String(password))
	} catch (err) {
		return res.status(400).json({ error: `${err}` })
	}

	// Check if the user already have a JWT
	if (req.headers.authorization !== undefined)
		return res.status(409).json({ error: 'Already logged' })

	// Check if the user with the provided email exist
	const exist = await newUser.findOne({ email: { $eq: email } })
	if (exist === null) {
		await new Promise((r) => setTimeout(r, 1000))
		return res.status(404).json({ error: `User ${email} not found` })
	}

	// Check if the hashed password in db and the provided password match
	const passwordIsValid = await bcrypt.compare(password, exist.password)

	if (passwordIsValid == true) {
		try {
			// Generate the new JWT
			const jwt = await callGenerateJWT(exist.username, email, exist.uuid)
			// Put him on the cookies of the response
			res.cookie('jwt', jwt)
			return res.status(200).json({ succes: 'Connection success!' })
		} catch (err) {
			res.status(500).json({ error: `${err}` })
		}
	} else {
		// Sleep for 1000ms (1s) to prevent bruteforce attack to work
		await new Promise((r) => setTimeout(r, 1000))
		return res.status(401).json({ error: `Invalid password` })
	}
})

auth.delete('/delete', async (req, res) => {
	const token = req.headers.authorization
	let email = req.body.email

	try {
		if (String(email) == '' || email === undefined) throw 'Missing email'
		if (String(token) == '' || token === undefined) throw 'Missing token'

		email = sanitizeUserInput(String(email).toLowerCase())

		if ((await callValidateJWT(token)) === false)
			return res.status(401).json({ error: 'Your JWT is not valid' })
	} catch (err) {
		return res.status(400).json({ error: `${err}` })
	}

	// Decode the JWT and parse is data into JS object
	const jwtData = JSON.parse(await callDecodeJWT(token))
	console.log(jwtData)
	// Check if the email provide and the email in the jwt match
	if (jwtData.email != email)
		return res.status(401).json({
			error: `The email on the JWT and the email provided doesnt match`,
		})
	// Try to delete the account
	let checkAction = await newUser.findOne({
		$and: [{ email: email }, { uuid: jwtData.uuid }],
	})
	if (checkAction === null)
		return res.status(404).json({ error: `An account doesnt exist` })
	checkAction = await newUser.deleteOne({
		$and: [{ email: email }, { uuid: jwtData.uuid }],
	})
	console.log('Number of account deleted ', checkAction.deletedCount)
	if (checkAction.deletedCount == 0)
		return res.status(500).json({
			succes: `Failed to delete ${email}. Please try again later`,
		})
	// In case of succes
	return res.status(200).json({ succes: `Deleted ${email} account` })
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
