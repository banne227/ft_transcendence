# "ft_transcendence" API :

<div align="center">
	<h1>Summary: </h1>
</div>

<h2 align="center">Access from everywhere</h2>

### POST Endpoint
- [/register](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#register--post)
- [/login](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#login--post)
- [/forget](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#forget--post)
- [/addscore](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#addscore--post)

### GET Endpoint
- [/health](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#health--get)
- [/countuser](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#countuser--get)
- [/logout](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#logout--get)
- [/jwt/validate](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#jwtvalidate--get)
- [/jwt/regenerate](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#jwtregenerate--get)
- [/history/user](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#historyuser--get)
- [/debug/db](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#debugdb--get)

### DELETE Endpoint
- [/delete](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#delete--get)

### PUT Endpoint
- [/changeSkin](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#changeskin--get)

<h2 align="center">Internal network endpoints</h2>

### GET Endpoint
- [/jwt/generate](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#jwtvalidate--get)
- [/jwt/regenerate](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#jwtvalidate--get)
- [/jwt/validate](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#jwtvalidate--get)
- [/jwt/decode](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#jwtvalidate--get)
- [/health](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#health--get)


### POST Endpoint
- [/addscore](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md#addscore--post)

<div align="center">
	<h1>Foreword:</h1>
</div>

- The body of every request should be in JSON format. So the header need to contain `Content-Type: application/json`
- You can use software like **Insomnia** or **Postman** to simulate request 
- Any user input who interact with the database will be sanitized to avoid NoSQLi or technic that could lead to an attacker to retrieve unauthorized data from the database. If the user put a character how is not on this list, the character is removed from his string. List of character accepted: `A-Z, a-z, 0-9, $,!,#,.,?,/,\,@,&,_,\,-,*`

<div align="center">
	<h1>Endpoints:</h1>
</div>

<div align=left>
	<h2>/register : POST</h2>
</div>

### Description
- This endpoint allow a user to create a account on the website (not perfect for now)
- The password of the user should be superior that 8 character, less that 128 character.
- The input of the user will be sanitized, only those character is allow to prevent user injection: a-z, A-Z, 0-9, $, !, #, ., ?, /, \, @, &, _, -, *
### Body
- The user need to provide those information in the body of the request: 
1. username = The username of the user to register
2. email = The email of the user to register
3. password = The password of the user to register
```cjson
/* What the body should look like */
{
	"username": "user",
	"password": "password",
	"email": "user@domain.ext"
}

/* or from a more compact way */
{"username": "user","password": "password","email": "user@domain.ext"}
```
### HTTP status code
- 200 : No error
- 400 : The entier or an element of request body is not valid.
- 401 : The username or the email of the user is already taken
- 409 : The user is already logged.
- 500 : Error during the creation of the user on the database

### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/auth/register`


<div align=left>
	<h2>/login : POST</h2>
</div>

### Description
- This endpoint allow a user to log into an account on the website (not perfect for now)
- The input of the user will be sanitized, only those character is allow to prevent user injection: a-z, A-Z, 0-9, $, !, #, ., ?, /, \, @, &, _, -, *
### Body
- The user need to provide those information in the body of the request: 
1. email = The email of the user to register
2. password = The password of the user to register
```cjson
/* What the body should look like */
{
	"email": "user@domain.ext",
	"password": "password",
}

/* or from a more compact way */
{"email": "user@domain.ext","password": "password"}
```
### HTTP status code
- 200 : No error
- 400 : The entier or an element of request body is not valid.
- 401 : The password provided is not valid
- 404 : The user doesnt exist
- 409 : The user is already logged.
- 500 : Error during the creation of the user on the database

### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/auth/login`

<div align=left>
	<h2>/addscore : POST</h2>
</div>

### Description
- This endpoint is available in internal by the game to append last game played to the played game history.
### Body
- The user need to provide those information in the body of the request: 
1. username = The username of the user
2. score = The new score of the user, it can be string or Number what ever the score will be store in BigInt on the database
```cjson
/* What the body should look like */
{
	"username": "user",
	"score": "444",
}

/* or from a more compact way */
{"username": "user","score": "444"}
```
### HTTP status code
- 200 : No error
- 400 : The body of request is not valid or the score is not a number.


### Usage
- Send the proper constructed request to `https://internal:1111/addscore`

<div align=left>
	<h2>/status : GET</h2>
</div>

### Description
- This endpoint is used to check if one of our microservices is down
- Give a list with every microservice + there state (UP/DOWN)

<div align=left>
	<h2>/delete : DELETE</h2>
</div>

### Description
- This endpoint will be to delete account in the database
### Header
- The user need to provide those information in the header of the request: 
1. authorization = The token of the user
### Body
- The user need to provide those information in the body of the request: 
1. email = The email of the user 
```cjson
/* What the body should look like */
{
	"email": "user@dom.ext"
}

/* or from a more compact way */
{"username": "user","score": "444","win": 0 | 1}
```
### HTTP status code
- 200 : No error
- 301 : The account cannot be deleted
- 400 : The email is missing

### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/auth/delete`

<div align=left>
	<h2>/jwt/validate : GET</h2>
</div>

### Description
- This endpoint will be probably only use by the API himself check if the JWT token provided on the **Authorization header** is valid
### Header
- The user need to provide those information in the header of the request: 
1. authorization = The token of the user
### HTTP status code
- 200 : No error
- 400 : The token is missing
- 401 : The provided token is not valid
- 500 : Failed to verify the user token

### Usage
- Send the proper constructed request to `http://internal:1111/jwt/validate`

<div align=left>
	<h2>/jwt/regenerate : GET</h2>
</div>

### Description
- This endpoint allow to regenerate a JWT token keep the user logged more longer. The client should fetch this endpoint to 
- The current JWT configuration do expire the token after 1d.
### Header
- The user need to provide those information in the header of the request: 
1. authorization = The token of the user
### HTTP status code
- 200 : No error
- 401 : The provided token is not valid
### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/jwt/regenerate`

<div align=left>
	<h2>/history/USER : GET</h2>
</div>

### Description
- This endpoint give a json with every match stored in the history of a user specified in parameter
- Should be used like this `https://transcendence.42.fr/api/history/gun8hoot`
### Parameter
- The name of the user
### HTTP status code
- 200 : No error
- 404 : The user doesnt exist on the database or the user havent played yet

### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/history/user`

<div align=left>
	<h2>/debug/db : GET</h2>
</div>

### Description
- This endpoint is for debug only and will be remove, it retrieve any information in the users collection of the database

### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/debuFg/db`

<div align=left>
	<h2>/changeSkin : PUT</h2>
</div>

### Description
- This endpoint is to change his ingame skin

### Header
- The user need to provide those information in the header of the request: 
1. authorization = The token of the user

### Body
```json
{
	"skin": 0,
}
```

### HTTP status code
- 200 : No error
- 400 : The jwt token or the skin color is invalid
- 404 : The user and the uuid are not both associates on the database


### Usage
- Send the proper constructed request to `https://transcendence.42.fr/api/changeskin`
