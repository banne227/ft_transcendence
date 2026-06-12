/*
 * STILL IN BUILD LOOK UGLY ASF
 */

// Initialized ExpressJS framework & mongoose lib (communicate with the db)
const express = require('express')
const mongoose = require('mongoose')
const { Schema, model } = mongoose

const user_model = new Schema({
	username: {
		require: true,
		type: String,
	},
	password: {
		require: true,
		type: String,
	},
	email: {
		require: true,
		minlenght: 6,
		type: String,
	},
	history: [
		{
			date: String,
			score: Number,
		},
	],
})
const newUser = model('users', user_model)

const api = express()
const PORT = 4444
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`

function isalnum(str) {
	for (let char in str) {
		if (
			!(str[char] >= 'a' && str[char] <= 'z') &&
			!(str[char] >= 'A' && str[char] >= 'Z') &&
			!(str[char] >= '0' && str[char] <= '9')
		) {
			return false
		}
	}
	return true
}

mongoose
	.connect(url)
	.then(() => {
		console.log(`Connected to ${url}`)
	})
	.catch((error) => {
		console.log(error)
	})

api.use(express.json())
api.use(express.urlencoded({ extended: true }))

/*
 * When stopping docker container, docker send SIGTERM
 * and then send a SIGKILL to stop the container
 */
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

/*
 * Endpoint to check from the client if the api is up
 * METHODE: GET
 */
api.get('/health', (req, ret) => {
	ret.send('API status : OK')
})

/*
 * Endpoint to register a user
 * METHODE: POST
 * BODY SYTHAX: JSON
 * BODY CONTENT:
 *   "username": "username of the user"
 *   "password": "password of the user"
 *   "email": "email of the user"
 */
api.post('/register', (req, ret) => {
	// Get the content of the body of the request
	const data = req.body

	// Check if a user with that username or his email exist
	const exits = newUser.findOne({
		$or: [{ email: data.email }, { username: data.username }],
	})

	// Check if the password of the user is superior that 12 character
	if (
		(String(data.password).length <= 12 &&
			String(data.password).length > 128) ||
		isalnum(data.password) == false
	) {
		console.log(`${data.password} is invalid!`)
		ret.send('invalid password')
	}
	// If the username and the email was already found on the DB
	if (!exits) {
		ret.send('Give a good username/email')
	} else {
		// Create the user on the db
		newUser.create({
			username: data.username,
			email: data.email,
			password: data.password,
			history: [],
		})
		// Tell to our client that our user have been created
		ret.send(`Create user ${data.username}`)
		// ret.status(200)
	}
})

// Start to listening for connection
api.listen(PORT, () => {
	console.log(`Listening on http://api:${PORT}`)
})
