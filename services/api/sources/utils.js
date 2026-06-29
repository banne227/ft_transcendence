const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

/* Check if the string "str" is composed only by alpha and numeric character */
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

/* Check if the string "str" is composed only by alpha and numeric character */
function isnum(str) {
	for (let char in str) {
		if (!(str[char] >= '0' && str[char] <= '9')) {
			return false
		}
	}
	return true
}

/* Generate a secure password hash with the specified password and a random salt */
async function generateHash(password) {
	const saltRound = 12
	// Generate the random salt for the password
	const salt = await bcrypt.genSalt(saltRound)
	// Generate the hash for the password
	const hash = await bcrypt.hash(password, salt)

	return String(hash)
}

/* This function take a string who was send by a client to prevent any injection */
function sanitizeUserInput(userInput) {
	let sanitizedString = ''

	for (let index = 0; index < userInput.length && index < 100; index++) {
		if (userInput[index].match(/[a-zA-Z0-9$!#.?/\\@&_\-*]+/) !== null) {
			sanitizedString = sanitizedString + userInput[index]
		}
	}
	return sanitizedString
}

/* Give access to other file to import those function */
module.exports = {
	isalnum,
	isnum,
	generateHash,
	sanitizeUserInput,
}
