// https://www.freecodecamp.org/news/build-a-custom-api-gateway-with-node-js/

/* Import requirement */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')

const PORT = process.env.GATEWAY_PORT // The port used by the gateway
const rateLimit = 20 // The number of req per minutes max
const interval = 60 * 1000 // Interval that define when the IP list should be wipe (1 minutes)
const requestLogged = {} // Who will contain every ip with the number of request they have done in the last 1 minutes
const gateway = express() // The server

// Configure middleware
gateway.use(cors()) // Handle Cross-Origin Ressource Sharing
gateway.use(helmet()) // Middleware to dont have XSS
gateway.use(morgan('combined')) // Logged on the console every connection done

gateway.disable('x-powered-by') // Disable x-powered-by on the header of the response
const services = [
	{ route: '/auth', target: 'http://auth:9999/' }, // Where the request should go when accessing to /auth
	{ route: '/', target: 'http://api:4444/' }, // Where the request should go when accessing to /api
]

// Exit the container on the good manner
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

// Reset The number of request done by an IP
setInterval(() => {
	Object.keys(requestLogged).forEach((ip) => {
		requestLogged[ip] = 0 // Reset request count for each IP address
	})
}, interval)

// Middleware function for rate limiting and timeout handling
function rateLimitAndTimeout(req, res, next) {
	const ip = req.ip // Get client IP address

	// Update request count for the current IP
	requestLogged[ip] = (requestLogged[ip] || 0) + 1

	// Check if request count exceeds the rate limit
	if (requestLogged[ip] > rateLimit) {
		// Respond with a 429 Too Many Requests status code
		return res.status(429).json({
			code: 429,
			status: 'Error',
			message: 'Rate limit exceeded.',
			data: null,
		})
	}

	// Set timeout for each request (example: 10 seconds)
	req.setTimeout(15000, () => {
		// Handle timeout error
		res.status(504).json({
			code: 504,
			status: 'Error',
			message: 'Gateway timeout.',
			data: null,
		})
		req.abort() // Abort the request
	})
	console.log(req.body)
	next() // Continue to the next middleware
}

// Apply the rate limit and timeout middleware to the proxy
gateway.use(rateLimitAndTimeout)

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
	// Proxy options
	const proxyOptions = {
		target,
		changeOrigin: true,
		pathRewrite: {
			[`^${route}`]: '',
		},
	}
	gateway.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions))
})

gateway.listen(PORT, () => {
	console.log(`[+] The gateway is listening on port ${PORT}`)
})
