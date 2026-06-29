const jsonwebtoken = require('jsonwebtoken')

function decodeJwt(jwt) {
	// Check if we have a jwt
	if (jwt === undefined || jwt === null) {
		throw undefined
	}
	// Split our jwt in three part
	let jwtData = jwt.split('.')
	// Return the payload decoded in plain text
	return atob(jwtData[1])
}

/* Generate token to not have to reconnect every time */
function generateJwt(email, uuid) {
	/* Get the secrete from the enviroment  */
	/* Initialized the payload for the jwt */
	const payload = {
		iss: 'https://transcendence.42.fr',
		date: Date.now(),
		email: email,
		uuid: uuid,
	}
	/* Create the token */
	token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '15m',
	})
	return token
}

/* Check if the JWT provided is valid */
function validateJwt(userJwt) {
	try {
		const valid = jsonwebtoken.verify(userJwt, process.env.JWT_SECRET)
		if (valid) {
			return true
		} else {
			return false
		}
	} catch (err) {
		console.log(err)
		return false
	}
}
