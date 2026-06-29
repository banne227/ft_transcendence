// Import every dependency
const express = require('express')
const mongoose = require('mongoose')
const {
	isalnum,
	isnum,
	generateHash,
	sanitizeUserInput,
} = require('./utils.js')

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

async function isUp(url) {
	try {
		response = await fetch(`${url}`, {
			method: 'GET',
		})
		console.log(response.status)
	} catch (err) {
		console.log('HERE')
		console.log(err)
	}
}

/* ----- GET REQUEST METHODE ----- */
api.get('/', (req, res) => {
	// Redirect the user to the API documentation
	res.status(301).redirect(
		'https://github.com/banne227/ft_transcendence/blob/main/docs/API.md',
	)
})

api.get('/health', async (req, res) => {
	res.status(200).json({ status: 'API status : OK' })
})

api.get('/countUser', async (req, res) => {
	let numberOfUser = await newUser.collection.count()
	res.status(200).json({ users: numberOfUser })
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

api.get('/user/:user/getcolor', async (req, res) => {
	const username = sanitizeUserInput(req.params.user)
	if (username === '')
		return res.status(400).json({ error: 'Invalid username' })
	const data = await newUser.findOne({ username: { $eq: username } }).lean()
	if (data === null)
		return res.status(404).json({ error: `cannot find ${username}` })
	return res.status(200).json({ color: data.color })
})

api.put('/changecolor', async (req, res) => {
	// Get the JWT from the header
	const jwt = req.headers.authorization
	// Get the skin from the body of the request
	const skinColor = req.body.color

	// Check if we have the jwt and the skin color
	if (skinColor === undefined)
		res.status(400).json({ error: 'Missing color' })
	// Check if the skin color composed by number
	// if (skinColor.match("^#([A-Fa-f0-9]6|[A-Fa-f0-9]3)$") == false)
	// res.status(400).json({ error: 'Invalid skinColor' })
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
				{ colors: skinColor },
			)
		} catch (err) {
			console.log(err)
			return res
				.status(404)
				.json({ succes: `Changed the skin to color: ${skinColor}` })
		}
		return res
			.status(200)
			.json({ succes: `Changed the skin to color: ${skinColor}` })
	}
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
		res.status(500).json({ error: `Cant delete account ${err}` })
	}
	// In case of succes
	res.status(200).json({ succes: `Deleted ${email} account` })
})

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
	}
})
