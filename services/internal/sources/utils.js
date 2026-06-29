const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/* Check if the string "str" is composed only by alpha and numeric character */
function isalnum(str) {
	for (let char in str) {
		if (
			!(str[char] >= "a" && str[char] <= "z") &&
			!(str[char] >= "A" && str[char] >= "Z") &&
			!(str[char] >= "0" && str[char] <= "9")
		) {
			return false;
		}
	}
	return true;
}

/* Check if the string "str" is composed only by alpha and numeric character */
function isnum(str) {
	for (let char in str) {
		if (!(str[char] >= "0" && str[char] <= "9")) {
			return false;
		}
	}
	return true;
}

/* Generate a secure password hash with the specified password and a random salt */
async function generateHash(password) {
	const saltRound = 12;
	// Generate the random salt for the password
	const salt = await bcrypt.genSalt(saltRound);
	// Generate the hash for the password
	const hash = await bcrypt.hash(password, salt);

	return String(hash);
}

function decodeJwt(jwt) {
	// Check if we have a jwt
	if (jwt === undefined || jwt === null) {
		throw undefined;
	}
	// Split our jwt in three part
	let jwtData = jwt.split(".");
	// Return the payload decoded in plain text
	return atob(jwtData[1]);
}

/* Generate token to not have to reconnect every time */
function generateJwt(email, uuid) {
	/* Get the secrete from the enviroment  */
	/* Initialized the payload for the jwt */
	const payload = {
		iss: "https://transcendence.42.fr",
		date: Date.now(),
		email: email,
		uuid: uuid,
	};
	/* Create the token */
	token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "15m",
	});
	return token;
}

/* Check if the JWT provided is valid */
function validateJwt(userJwt) {
	try {
		const valid = jwt.verify(userJwt, process.env.JWT_SECRET);
		if (valid) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
}

/* This function take a string who was send by a client to prevent any injection */
function sanitizeUserInput(userInput) {
	let sanitizedString = "";

	for (let index = 0; index < userInput.length && index < 100; index++) {
		if (userInput[index].match(/[a-zA-Z0-9$!#.?/\\@&_\-*]+/) !== null) {
			sanitizedString = sanitizedString + userInput[index];
		}
	}
	return sanitizedString;
}

/* Give access to other file to import those function */
module.exports = {
	isalnum,
	generateHash,
	generateJwt,
	validateJwt,
	sanitizeUserInput,
	isnum,
	decodeJwt,
};
