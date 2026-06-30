// Import every dependency
const express = require('express')
const mongoose = require('mongoose')

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

/* This function take a string who was send by a client to prevent any injection */
function sanitizeUserInput(userInput) {
	let sanitizedString = ''

	for (let index = 0; index < userInput.length && index < 128; index++) {
		if (userInput[index].match(/[a-zA-Z0-9$!#.?/\\@&_\-*]+/) !== null) {
			sanitizedString = sanitizedString + userInput[index]
		}
	}
	return sanitizedString
}

/*
 * When stopping docker container, docker send SIGTERM
 * to the container. This function is a special signal
 * handler when the container recieve a SIGTERM
 */
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

/* ----- GET REQUEST METHODE ----- */
api.get('/', (req, res) => {
	// Redirect the user to the API documentation
	res.status(301).redirect(
		'https://github.com/banne227/ft_transcendence/blob/main/docs/API.md',
	)
})

// Lightest pages to know if the services is down
api.get('/health', async (req, res) => {
	res.status(200).json({ status: 'API status : OK' })
})

// Retrieve the history of every match of a user
api.get('/history/:userName', async (req, res) => {
	// Get the username specified in uri parameter
	const username = sanitizeUserInput(req.params.userName)
	// Searching for the user on the db
	const data = await newUser
		.findOne({ username: { $eq: username } }, '-history._id')
		.lean()
	// if the user doesnt exist
	if (data === null)
		return res
			.status(404)
			.json({ error: { message: `cannot find ${username}`, code: 404 } })
	// if the user exist but it doesnt played a single match
	if (data.history == '[]')
		return res
			.status(404)
			.json({ error: `${username} didnt have played yet` })
	// Send the history in a json format
	return res.status(200).json(data.history)
})

// Retrieve the skin color of a user
api.get('/user/:user/getcolor', async (req, res) => {
	const username = sanitizeUserInput(req.params.user)
	if (username === '')
		return res.status(400).json({ error: 'Invalid username' })
	const data = await newUser.findOne({ username: { $eq: username } }).lean()
	if (data === null)
		return res.status(404).json({ error: `cannot find ${username}` })
	return res.status(200).json({ color: data.color })
})

// --- TO COMMENT ---
api.get('/debug/db', async (req, res) => {
	const rrr = await newUser.find()

	console.log(rrr)
	if (rrr === undefined || rrr.length == 0)
		res.status(200).json({ info: 'The database is empty' })
	res.status(200).json(rrr)
})

// Start our API
api.listen(PORT, (err) => {
	if (!err) {
		console.log(
			`Listening on https://transcendence.42.fr/api or http://api:${PORT} in the docker network`,
		)
	} else {
		console.log(err)
	}
})
