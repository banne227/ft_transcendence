const mongoose = require('mongoose')
const { Schema, model } = mongoose

const itemModel = new Schema({
	username: String,
	bestScore: BigInt,
	date: String,
})

const stackModel = new Schema({
	users: [itemModel],
})

const stack = model('leaderboard', stackModel)
module.exports = {
	stack,
}
