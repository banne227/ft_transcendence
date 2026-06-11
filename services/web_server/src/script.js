const express = require('express')
const gateway = express()
const port = 8080

gateway.get('/', (req, res) => {
	res.send('hello')
})

gateway.listen(port, () => {
	console.log('asdasd')
})
