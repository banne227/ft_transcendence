const bcrypt = require('bcryptjs')

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

	for (let index = 0; index < userInput.length; index++) {
		if (userInput[index].match(/[a-zA-Z0-9$!#.?/\\@&_\-*]+/) !== null) {
			sanitizedString = sanitizedString + userInput[index]
		}
	}
	if (sanitizedString == '')
		throw `Invalid string ${sanitizedString.substring(0, 128)}`
	return sanitizedString
}

/* Give access to other file to import those function */
module.exports = {
	generateHash,
	sanitizeUserInput,
}
