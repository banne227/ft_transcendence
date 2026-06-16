const mongoose = require('mongoose')
const { Schema, model } = mongoose
// Database user schemas

const user_model = new Schema({
	username: {
		require: true,
		type: String,
		index: true,
	},
	password: {
		require: true,
		type: String,
		index: true,
	},
	email: {
		require: true,
		minlenght: 6,
		type: String,
		index: true,
	},
	history: [
		{
			date: String,
			score: BigInt,
		},
	],
})
const newUser = model('users', user_model)
module.exports = {
	newUser,
}
