# express-js-rest-api
An REST API with basic CRUD with the ORM Knex Framework , login using JWT Authentication and password recovery

#### This project was created with the intention of studying API in depth, using the body parser to handle requests.

## This API has 2 Controllers and 2 models:

* HomeController => used only to display a welcome message.

* UserController => handles the following methods:

  - index: displays list of all registered users
  - findUser: finds a user by ID.
  - create: register a user.
  - edit: edits a previously registered user.
  - remove: delete a registered user.
  - recoverPassword: enable password recovery using Token generated via JWT.
  - login: authenticate a valid user

## The UserController methods access 2 models:

* PasswordToken => model that handles the table `password_token`:

  - create: to create a token.
  - validate: to validate a token
  - setUsed: to change the token state to used.
  
* User => model that handle the table `users`
  - new
  - findEmail
  - findAll
  - changePassword
  - findById
  - update
  - delete
  
 ## The Routes are protected by JWT defined as middleware.
 
 The CRUD uses the MYSQL database named `apiusers` to store the data, all the config is defined in the file `connection.js`.
 
