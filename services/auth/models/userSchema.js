const mongoose = require('mongoose')
const { Schema, model } = mongoose
// Database user schemas

const history_model = new Schema({
	date: String,
	score: Number,
	win: Boolean,
})

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
		type: String,
	},
	uuid: {
		require: true,
		type: String,
	},
	data: {
		history: [history_model],
		color: {
			require: true,
			type: String,
			Default: '#ffffff',
		},
	},
})
const newUser = model('users', user_model)
module.exports = {
	newUser,
}
