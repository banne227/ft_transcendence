const mongoose = require('mongoose')
const url = 'mongodb://user:user@127.0.0.1/databases'

mongoose
	.connect(url)
	.then(() => {
		res.send(`Connected to ${url}`)
	})
	.catch((error) => {
		console.log(error)
	})
