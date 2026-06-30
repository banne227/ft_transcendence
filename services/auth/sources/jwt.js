async function callGenerateJWT(emailValue, uuidValue) {
	const url = `http://internal:1111/jwt/generate?${new URLSearchParams({ email: emailValue, uuid: uuidValue })}`

	const response = await fetch(url, {
		method: 'GET',
	})
	if (response.status !== 200) {
		throw `The user have been created but something wrong happen when generating a new token for the user. Please try again later`
	}
	const body = await response.json()
	if (body === undefined || body == null)
		throw `The user have been created but something wrong happen when generating a new token for the user. Please try again later`
	return body.jwt
}

async function callValidateJWT(tokenValue) {
	const url = `http://internal:1111/jwt/validate`

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			authorization: `${tokenValue}`,
		},
	})
	if ((await response.status) === 200) {
		return true
	} else if ((await response.status) === 401) {
		return false
	} else {
		throw 'Failed to verify the user JWT'
	}
}

async function callDecodeJWT(tokenValue) {
	const url = `http://internal:1111/jwt/decode?jwt=${tokenValue}`

	const response = await fetch(url, {
		method: 'GET',
	})
	const data = await response.json()
	console.log(data)
	if (response.status == 200) {
		return data
	} else {
		throw `${response.status}`
	}
}

module.exports = { callGenerateJWT, callValidateJWT, callDecodeJWT }
