import mongoose, { models } from 'mongoose'
const { Schema, model } = mongoose
// Database user schemas

const user_model = new Schema({
	username: {
		require: true,
		ref: 'The username of the user',
		type: String,
	},
	password: {
		require: true,
		ref: 'The hashed password of the user',
		type: String,
	},
	email: {
		require: true,
		ref: 'The email of the user',
		minLenght: 6,
		type: String,
	},
	history: [
		{
			rel: 'Array with the date and the score of passed matches',
			date: String,
			score: Number,
		},
	],
})

const userScheme = models('user', user_model)
export default userScheme
