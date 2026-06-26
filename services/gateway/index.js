// https://www.freecodecamp.org/news/build-a-custom-api-gateway-with-node-js/

/* Import requirement */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { createProxyMiddleware } = require('http-proxy-middleware')

// Define constant
const PORT = process.env.GATEWAY_PORT
const rateLimit = 20 // req per minutes max
const interval = 60 * 1000 // Interval that define when every should be remove from the list (1 minutes)
const requestLogged = {} // Who will contain every ip with the number of request they have done in the last 1 minutes
const gateway = express()

// Configure middleware
gateway.use(cors())
gateway.use(helmet())
gateway.use(morgan('combined'))
gateway.disable('x-powered-by')

const services = [
	{ route: '/auth', target: 'http://auth:9999/' },
	{ route: '/', target: 'http://api:4444/' },
]

/*
 * When stopping docker container, docker send SIGTERM
 * to the container. This function is a special signal
 * handler when the container recieve a SIGTERM
 */
process.on('SIGTERM', (code_signal_error) => {
	process.exit(0)
})

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
