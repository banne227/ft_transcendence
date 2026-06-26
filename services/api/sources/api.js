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
} = require('./utils')
const { jwt } = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Import mongoose models
const { newUser } = require('./models/userSchema')

// Port used by our API
const PORT = 4444
// URL of our mongodb database
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`

// Create the webserver with ExpressJS
const api = express()

// Initialized connection to the database
mongoose
	.connect(url)
	.then(() => {
		console.log(`Connected to ${url}`)
	})
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})

// Specify to expressjs that we will get json syntax body
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.disable('x-powered-by')

/*
 * When stopping docker container, docker send SIGTERM
 * to the container. This function is a special signal
 * handler when the container recieve a SIGTERM
 */
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

/* ----- GET REQUEST METHODE ----- */
api.get('/health', (req, res) => {
	res.status(200).json({ status: 'API status : OK' })
})

api.get('/countUser', async (req, res) => {
	let numberOfUser = await newUser.collection.count()
	res.status(200).json({ users: numberOfUser })
})

api.get('/', (req, res) => {
	// Redirect the user to the API documentation
	res.status(301).redirect(
		'https://github.com/banne227/ft_transcendence/blob/main/docs/API.md',
	)
})

api.get('/jwt/validate', (req, res) => {
	// Take the JWT from the authorization section in the header
	const token = req.headers.authorization

	// Check if a token is on the authorization header
	if (token === undefined) {
		return res.status(400).json({ error: 'No token provided' })
	}

	// Use the function to check if the token was not altered
	const valid = validateJwt(token)
	if (valid) {
		return res.status(200).json({ succes: 'The JWT is valid' })
	} else {
		return res.status(401).json({ error: 'Invalid JWT' })
	}
})

api.get('/jwt/regenerate', async (req, res) => {
	// Take the token from the header
	const currentToken = req.headers.authorization

	console.log(currentToken)
	if (currentToken === undefined) {
		return res
			.status(200)
			.json({ succes: 'The user is currently not logged' })
	}

	try {
		// Verify the token using the jwt verify methode
		const { uuid, email } = jwt.verify(currentToken, process.env.JWT_SECRET)
		// If the uuid or the email of the JWT is empty
		if (!uuid || !email) {
			return res.status(401).json({ error: 'Invalid token' })
		}
		// Search on the database if a user who have this uuid and this email exist
		const userData = await newUser.findOne({
			$and: [{ email: email }, { uuid: uuid }],
		})
		// If not exist
		if (userData === null) {
			return res.status(401).json({ error: 'Invalid token' })
		}
		// Generating our new jwt and put him on the cookie of the response
		res.cookie('jwt', generateJwt(email, uuid))
		// Say that we have succesfully create the token
		return res
			.status(200)
			.json({ succes: 'Token successfully regenerated' })
	} catch (err) {
		// Check if the error catch is because the token expired
		if (err.name === 'TokenExpiredError')
			return res.status(401).json({ error: 'Token has expired' })
		// Dfault error
		return res.status(401).json({ error: 'Invalid token' })
	}
})

api.get('/history/:userName', async (req, res) => {
	// Get the username specified in uri parameter
	const username = sanitizeUserInput(req.params.userName)
	// Searching for the user on the db
	const data = await newUser
		.findOne({ username: { $eq: username } }, '-history._id')
		.lean()
	// if the user doesnt exist
	if (data === null)
		return res.status(404).json({ error: `cannot find ${username}` })
	// if the user exist but it doesnt played a single match
	if (data.history == '[]')
		return res
			.status(404)
			.json({ error: `${username} didnt have played yet` })
	// Send the history in a json format
	return res.status(200).json(data.history)
})

/* ----- POST REQUEST METHODE ----- */
api.post('/addScore', async (req, res) => {
	let { score, username } = req.body

	score = sanitizeUserInput(score)
	username = sanitizeUserInput(username)
	// Check if the body contain a username and a score
	if (username === undefined || score === undefined)
		return res.status(400).json({ error: 'Missing body content' })

	// Check if the score is valid
	if (isNaN(Number(score))) {
		return res.status(400).json({ error: 'Bad score type' })
	}

	// Creating our history object
	const newData = { date: `${new Date()}`, score: Number(score) }
	// Get the current date
	const timestamp = new Date()

	// Pushing our new score into the history array
	await newUser.updateOne(
		{ username: username },
		{
			$push: {
				history: [
					{
						date: `${timestamp.toISOString()}`,
						score: Number(score),
					},
				],
			},
		},
	)
	return res.status(200).json({
		succes: `Added ${username}:${score}`,
	})
})

api.get('/logged', async (req, res) => {
	// Take the jwt from the request
	const token = req.authorization
	res.status(404).json({ error: 'No finish yettt' })
})

api.put('/changeSkin', async (req, res) => {
	// Get the JWT from the header
	const jwt = req.headers.authorization
	// Get the skin from the body of the request
	const skinColor = req.body.skin

	// Check if we have the jwt and the skin color
	if (jwt === undefined || skinColor === undefined)
		res.status(400).json({ error: 'Missing header or body data' })
	// Check if the skin color composed by number
	if (isnum(skinColor) == false)
		res.status(400).json({ error: 'Invalid skinColor' })
	// Decode the payload of the JWT and put his content to JSON
	const jwtPayload = JSON.parse(decodeJwt(jwt))
	// Search on the database if we got an account with this email and this uuid
	let user = await newUser.findOne({
		$and: [{ email: jwtPayload.email }, { uuid: jwtPayload.uuid }],
	})
	// If we found nothing
	if (user === null)
		return res.status(404).json({ error: `User ${jwtPayload.email}` })
	// Update the database with the new skin
	user = await newUser.updateOne(
		{
			$and: [{ email: jwtPayload.email }, { uuid: jwtPayload.uuid }],
		},
		{ skin: skinColor },
	)
	return res.json({ succes: `Changed the skin to ${skinColor}` })
})

/* ----- DELETE REQUEST METHODE ----- */
api.delete('/delete', async (req, res) => {
	// Take the JWT from the authorization section in the header
	const token = req.headers.authorization
	// Take the email from the body
	const email = sanitizeUserInput(String(req.body.email).toLowerCase())

	// If the email wasnt set
	if (email === undefined) {
		res.status(400).json({ error: 'Email not provided' })
	}
	try {
		// Try to delete the account
		await newUser
			.find({ email: { $eq: email } })
			.deleteOne()
			.exec()
	} catch (err) {
		// In case of error
		res.status(301).json({ error: `Cant delete account ${err}` })
	}
	// In case of succes
	res.status(200).json({ succes: `Deleted ${email} account` })
})

api.get('/debug/db', async (req, res) => {
	const rrr = await newUser.find()

	res.status(200).json(rrr)
})

// Start our API
api.listen(PORT, (err) => {
	if (!err) {
		console.log(
			`Listening on https://transcendence.42.fr/api or http://api:${PORT} in the docker network`,
		)
	}
})
