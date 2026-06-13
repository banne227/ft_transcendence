# "ft_transcendence" API :
- Every body request and response need to be and will be in JSON
## Available endpoint:
## /register : POST
- /register use the **POST methode** for this endpoint 
- This endpoint allow a user to create a account on the website (not perfect for now)
- Actually no protection against raid/spam is provided, i will put humain verification when someone will register a new account
- The password of the user should be superior that 12 character, less that 128 character and use only alpha numerical character
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
## /login : POST
- /login use the **POST methode** for this endpoint 
- This endpoint allow to log to an account on the website (not perfect for now)
- Actually no protection against raid/spam is provided, i will put humain verification when someone will register a new account
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
{"password": "password","email": "user@domain.ext"}
```
## /forget : POST
- /forget use the **POST methode**
- This endpoint allow a user to edit the password of his account. For now this endpoint dont have any protection
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
{"password": "password","email": "user@domain.ext"}
```

## /health : GET
- /login use the **GET methode** for this endpoint 
- This endpoint allow from the client if the API is down

## /countuser : GET
- /login use the **GET methode** for this endpoint 
- User will not be allow to interact with this endpoint
- It allow to know how many different user have an account on the site

## /logout : GET
- /logout use the **GET methode** for this endpoint 
- This endpoint the user to get logout from his account (not finish for now)

## /jwt/validate : GET
- /jwt/validate use the **GET methode**
- This endpoint is to check if a provided jwt is valid or not
- The jwt should be passed in the authorization header
