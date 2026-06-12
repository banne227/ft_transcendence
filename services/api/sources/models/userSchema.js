const mongoose = require('mongoose')
const { Schema, model } = mongoose
// Database user schemas

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

const user = model('user', user_model)
module.exports = user
