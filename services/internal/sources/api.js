// Import every dependency
const express = require('express')
const mongoose = require('mongoose')
const {
	generateJwt,
	validateJwt,
	sanitizeUserInput,
	decodeJwt,
} = require('./utils')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Import mongoose models
const { newUser } = require('./models/userSchema')

// Port used by our API
const PORT = 1111
// URL of our mongodb database
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`

// Create the webserver with ExpressJS
const api = express()

api.get('/health', (_req, res) => {
	res.status(200).json({
		status: 'UP',
	})
})

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

api.get('/jwt/validate', async (req, res) => {
	// Take the JWT from the authorization section in the header
	const currentToken = req.headers.authorization

	// Check if a token is on the authorization header
	if (currentToken === undefined) {
		return res.status(400).json({ error: 'No token provided' })
	}

	if (currentToken.match(/^((?:\.?(?:[A-Za-z0-9-_]+)){3})$/) === null)
		return res.status(400).json({ error: 'Invalid token' })
	// Use the function to check if the token was not altered
	try {
		const valid = jwt.verify(currentToken, process.env.JWT_SECRET)
		if (!valid) {
			return res.status(401).json({ error: 'Invalid JWT' })
		}
		return res.status(200).json({ succes: 'The JWT is valid' })
	} catch (err) {
		return res.status(500).json({ error: 'Failed to verify the JWT' })
	}
})

api.get('/jwt/regenerate', async (req, res) => {
	// Take the token from the header
	const currentToken = req.headers.authorization

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

api.get('/jwt/generate', (req, res) => {
	const { email, uuid } = req.query

	// Check if we got something in parameter
	if (email === undefined)
		return res.status(400).json({ error: 'Missing email' })
	if (uuid === undefined)
		return res.status(400).json({ error: 'Missing uuid' })

	// Building the JWT payload
	const payload = {
		iss: 'https://transcendence.42.fr',
		date: Date.now(),
		email: email,
		uuid: uuid,
	}

	try {
		const currentToken = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '1d',
		})
		return res.status(200).json({ jwt: currentToken })
	} catch (err) {
		return res.status(500).json({ error: 'Failed to generate JWT' })
	}
})

api.get('/jwt/decode', async (req, res) => {
	// const { jwt } = req.query
	const jwt = req.headers.authorization
	// Check if we have a jwt
	if (jwt === undefined) {
		return res.status(400).json({ error: 'Missing JWT' })
	}

	// Check if the provided jwt is valid
	const request = await fetch(`http://internal:1111/jwt/validate`, {
		method: 'GET',
		headers: {
			authorization: `${jwt}`,
		},
	})
	const response = await request.json()
	if (request.status !== 200) {
		return res.status(request.status).json({
			error: 'The provided JWT is not valid!',
		})
	}

	// Split our jwt in three part
	let jwtData = jwt.split('.')
	// Return the payload decoded in plain text
	return res.status(200).json(atob(jwtData[1]))
})

api.post('/addScore', async (req, res) => {
	let { score, username } = req.body

	// Check if the body contain a username and a score
	if (username === undefined || score === undefined)
		return res.status(400).json({ error: 'Missing body content' })

	score = sanitizeUserInput(score)
	username = sanitizeUserInput(username)

	// Check if the score is valid
	if (isNaN(Number(score))) {
		return res.status(400).json({ error: 'Bad score type' })
	}

	// Get the current date
	const timestamp = new Date()

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
			console.log('catch')
		})
	return res.status(200).json({
		succes: `Added ${username}:${score}`,
	})
})

// Change the color of his snake on the database
api.put('/user/changecolor', async (req, res) => {
	// Get the JWT from the header
	const jwt = req.headers.authorization
	// Get the skin from the body of the request
	const newColor = req.body.color

	// Check if we have the jwt and the skin color
	if (newColor === undefined) res.status(400).json({ error: 'Missing color' })
	// Check if the skin color composed by number
	// if (newColor.match("^#([A-Fa-f0-9]6|[A-Fa-f0-9]3)$") == false)
	// res.status(400).json({ error: 'Invalid newColor' })
	// Decode the payload of the JWT and put his content to JSON
	if (jwt !== undefined) {
		const jwtPayload = JSON.parse(decodeJwt(jwt))
		// Search on the database if we got an account with this email and this uuid
		let user = await newUser.findOne({
			$and: [{ email: jwtPayload.email }, { uuid: jwtPayload.uuid }],
		})
		// If we found nothing
		if (user === null)
			return res.status(404).json({
				error: `Provided account information invalid`,
			})
		// Update the database with the new skin
		try {
			user = await newUser.updateOne(
				{
					$and: [
						{ email: jwtPayload.email },
						{ uuid: jwtPayload.uuid },
					],
				},
				{ colors: newColor },
			)
		} catch (err) {
			console.log(err)
			return res
				.status(404)
				.json({ succes: `Changed the skin to color: ${newColor}` })
		}
		return res
			.status(200)
			.json({ succes: `Changed the skin to color: ${newColor}` })
	}
})

// Start our API
api.listen(PORT, (err) => {
	if (!err) {
		console.log(
			`Listening on https://transcendence.42.fr/api or http://internal:${PORT} in the docker network`,
		)
	}
})
