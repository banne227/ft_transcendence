// Import every dependency
const express = require('express')
const mongoose = require('mongoose')
const {
	isalnum,
	generateHash,
	generateJwt,
	validateJwt,
	checkData,
} = require('./utils')
const { jwt } = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Import mongoose models
const { newUser } = require('./models/userSchema')
const { stack } = require('./models/leaderboardStack')

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
	})

// Specify to expressjs that we will get json syntax body
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.disable('x-powered-by')

/*
 * When stopping docker container, docker send SIGTERM
 * and then send a SIGKILL to stop the container
 */
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

/* ----- GET REQUEST METHODE ----- */

/*
 * Endpoint to check from the client if the api is up
 * METHODE: GET
 */
api.get('/health', (req, res) => {
	res.status(200).json({ status: 'API status : OK' })
})

/*
 * Endpoint to retrieve the number of users currently register in the database
 * METHODE: GET
 */
api.get('/countUser', async (req, res) => {
	let numberOfUser = await newUser.collection.count()
	res.status(200).json({ users: numberOfUser })
})

/*
 * Endpoint to log out the user connected to this session
 * METHODE: GET
 */
api.get('/logout', (req, res) => {
	res.redirect('/')
})

api.get('/', (req, res) => {
	res.redirect(
		'https://github.com/banne227/ft_transcendence/blob/main/docs/API.md',
	)
})

api.get('/delete', async (req, res) => {
	// Take the JWT from the authorization section in the header
	const token = req.headers.authorization
	// Take the email from the body
	const email = req.body.email

	// If the email wasnt set
	if (email === undefined) {
		res.status(301).json({ error: 'Email not provided' })
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
	res.status(200).json({ succes: 'Deleted' })
})

/*
 * Endpoint to check if the user jwt is valid
 * METHODE: GET
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "jwt": "jwt of the user"
 * RETURN STATUS CODES:s
 *  - 200 : The jwt of the user is fine
 *  - 401 : The jwt of the user isnt valid
 *  - 400 : The user doesnt have jwt
 */
api.get('/jwt/validate', (req, res) => {
	// Take the JWT from the authorization section in the header
	const token = req.headers.authorization

	// Check if a token is on the authorization header
	if (!token) {
		res.status(400).json({ error: 'No token provided' })
	}
	// Use the function to check if the token was not altered
	const valid = validateJwt(token)
	if (valid) {
		res.status(200).json({ succes: 'The JWT is valid' })
	} else {
		res.status(401).json({ error: 'Invalid JWT' })
	}
})

// Get the complete match history of a user by going to /api/history/USERNAME
api.get('/history/:userName', async (req, res) => {
	// Get the username specified in uri parameter
	const username = req.params.userName
	// Searching for the user on the db
	const aaa = await newUser
		.findOne({ username: { $eq: username } }, '-history._id')
		.lean()
	// if the user doesnt exist
	if (aaa === null) res.status(404).json({ error: `cannot find ${username}` })
	// if the user exist but it doesnt played a single match
	if (aaa.history === null)
		res.status(404).json({ error: `${username} didnt have played yet` })
	// Send the history in a json format
	res.status(200).json(aaa.history)
})

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
 * ADDITIONAL NOTES:
 *   JWT need to be store in the localstorage section of the browser
 *   and be passed in the authorization headers of the request
 * REF:
 *   - https://www.youtube.com/watch?v=UBUNrFtufWo
 */
api.post('/register', async (req, res) => {
	// Get the content of the body of the request
	const data = req.body

	// Check if the user have put an username, password, and email
	if (
		data.username === undefined ||
		data.password === undefined ||
		data.email === undefined
	)
		return res.status(400).json({ error: 'Invalid body' })

	// Check if the data send is less
	for (datas in data) {
		if (
			String(data.password).length <= 3 ||
			String(data.password).length > 128 ||
			checkData(data.datas) === false
		) {
			return res.status(400).json({ error: `invalid format in ${datas}` })
		} else {
			console.log(`data`)
		}
	}

	// Search in the database who have the same username and email than the user (partially work the 12/06)
	const exist = await newUser.findOne({
		$or: [
			{ email: { $eq: data.email } },
			{ username: { $eq: data.username } },
		],
	})

	// If a user or a email is already associate with da account
	if (exist !== null)
		return res.status(401).json({
			error: `The username ${String(data.username).substring(0, 20)} or the email ${String(data.email).substring(0, 20)} is already taken`,
		})

	// Create the user on the db
	await newUser.create({
		username: data.username,
		email: data.email,
		password: await generateHash(data.password),
		history: [],
	})
	// Creating our JWT
	const jwt = generateJwt(data)
	// Putting the JWT in the cookie response for the client
	res.cookie('jwt', jwt)
	// Tell to our client that our user have been created by sending a status code 200
	return res.status(200).json({ jwt: jwt })
})

/*
 * Endpoint to log in a user
 * METHODE: POST
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "password": "password of the user"
 *   "email": "email of the user"
 *   "keeplog": boolean
 * RETURN STATUS CODES:
 *  - 200 : Everything is fine
 *  - 404 : The email provided or the password isnt valid
 */
api.post('/login', async (req, res) => {
	// Get the body of the request
	const data = req.body

	// Check if the email and the password is here
	if (data.email === null || data.password === null)
		return res.sendStatus(400)

	// Check if the user with the provided email exist
	const exist = await newUser.findOne({ email: { $eq: data.email } })
	if (exist === null) {
		// Send a 404
		return res.status(404).json({ error: `User ${data.email} not found` })
	}

	// Check if the hashed password in db and the provided password match
	const valid = await bcrypt.compare(data.password, exist.password)
	if (valid == true) {
		res.cookie('jwt', generateJwt(data))
		return res.status(200).send(`Connection success!`)
	} else {
		return res.status(401).send(`Invalid password`)
	}
})

/*
 * Endpoint to modify the password of the user (no authentification for now)
 * METHODE: POST
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "newPassword": "the new password of the user"
 *   "email": "email of the user"
 * RETURN STATUS CODES:
 *  - 200 : Everything is fine
 *  - 400 : Missing email or/and password
 *  - 400 : The password is invalid or the email is not associate to an account
 */
api.post('/forget', async (req, res) => {
	const data = req.body

	// Check if the a email and a password is on the body
	if (data.email === undefined || data.password === undefined)
		return res.sendStatus(400)

	// Check if the password of the user is superior that 12 character
	if (
		(String(data.password).length <= 12 &&
			String(data.password).length > 128) ||
		isalnum(data.password) == false
	) {
		return res.status(401).json({ error: 'invalid password' })
	}

	// Search on the database if the user exist
	let user = await newUser.findOne({ email: { $eq: data.email } })
	// If not exist
	if (!user)
		return res.status(401).json({ error: 'cannot edit the password' })
	// Update the password associate to the email on the database
	user = await newUser.updateOne(
		{ email: data.email },
		{ password: generateHash(data.password) },
	)
	res.status(200).json({
		succes: 'The password have been succesfully changed',
	})
})

/*
 * Endpoint append data to the leaderboard. This endpoint should be only used by the game server
 * METHODE: POST
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "username": "The username of the user"
 *   "score": "The score of the user"
 * RETURN STATUS CODES:
 */
api.post('/addScore', async (req, res) => {
	// Check if the body contain a username and a score
	if (!req.body.username || !req.body.score)
		res.status(400).json({ error: 'Missing body content' })

	// Check if the score contain only numeric character
	if (req.body.score.match(/^[0-9]+$/) == null)
		res.status(400).json({ error: 'Bad score type' })

	// Creating our history object
	const newData = { date: `${new Date()}`, score: BigInt(req.body.score) }
	// Get the current date
	const timestamp = new Date()

	// Pushing our new score into the history array
	await newUser.updateOne(
		{ username: req.body.username },
		{
			$push: {
				history: [
					{
						date: `${timestamp.toISOString()}`,
						score: Number(req.body.score),
					},
				],
			},
		},
	)
	res.status(200).json({
		succes: `Added ${req.body.username}:${req.body.score}`,
	})
})

// Start our API
api.listen(PORT, (err) => {
	if (!err) {
		console.log(
			`Listening on https://transcendence.42.fr/api or http://api:${PORT} in the docker network`,
		)
	}
})
