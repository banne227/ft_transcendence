const mongoose = require('mongoose')
const { Schema, model } = mongoose
// Database user schemas

const history_model = new Schema({
	date: String,
	score: {
		type: Number,
		default: 0,
	},
	win: { type: Boolean, default: false },
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
		index: true,
	},
	color: {
		type: String,
		index: true,
		default: '#ffffff',
	},
	history: [history_model],
})
const newUser = model('users', user_model)
module.exports = {
	newUser,
}
