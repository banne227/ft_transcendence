const express = require('express')

const internal = express()

internal.listen(65535, () => {
	console.log('Internal api is listening on port 65535')
})
