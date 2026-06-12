// Initialized ExpressJS framework & mongoose lib (communicate with the db)
const express = require('express')
const mongoose = require('mongoose')
const userScheme = require('./models/userSchema')

const api = express()
const PORT = 4444
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb/databases`

console.log(`${url}`)
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
 */
api.get('/health', (req, ret) => {
	ret.send('API status : OK')
})

api.post('/register', (req, ret) => {
	const data = req.body
	const exits = userScheme.findOne({
		$or: [{ email: data.email }, { username: data.username }],
	})
	if (data.password.lenght <= 12)
		ret.send("invalid password")
	if (exits) {
		ret.send('Give a good username/email')
	} else {
		const user = new userScheme({
			name: data.user,
			email: data.email,
			password: data.password,  // WILL HASHED LATER
			history: [],
		})
		user.save();
	}
})

// Start to listening for connection
api.listen(PORT, () => {
	console.log(`Listening on http://api:${PORT}`)
})
