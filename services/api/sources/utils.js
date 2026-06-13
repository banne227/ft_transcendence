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

/* Generate a secure password hash with the specified password and a random salt */
async function generateHash(password) {
	const saltRound = 12;
	// Generate the random salt for the password
	const salt = await bcrypt.genSalt(saltRound);
	// Generate the hash for the password
	const hash = await bcrypt.hash(password, salt);

	return String(hash);
}

/* Generate token to not have to reconnect every time */
function generateJwt(userdata) {
	/* Get the secrete from the enviroment  */
	const key = process.env.JWT_SECRET;
	/* Initialized the payload for the jwt */
	const payload = {
		date: Date(),
		email: userdata.email,
	};
	/* Create the token */
	token = jwt.sign(payload, key, { expiresIn: "1d" });
	return token;
}

/* Check if the JWT provided is valid */
function validateJwt(userJwt) {
	const key = process.env.JWT_HEADER_KEY;
	const secrete = process.env.JWT_SECRET;
	const valid = jwt.verify(userJwt, secrete);
	if (valid) {
		return true;
	}
	return false;
}

/* Check if the data send by the user is valid */
function checkData(str) {
	console.log(str);
	for (char in str) {
		if (
			!(str[char] >= "a" && str[char] <= "z") &&
			!(str[char] >= "A" && str[char] >= "Z") &&
			!(str[char] >= "0" && str[char] <= "9") &&
			str[char] != "_" &&
			str[char] != "-" &&
			str[char] != "!" &&
			str[char] != "@" &&
			str[char] != "#"
		) {
			return false;
		}
	}
}

/* Give access to other file to import those function */
module.exports = { isalnum, generateHash, generateJwt, validateJwt, checkData };
