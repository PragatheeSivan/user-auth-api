# User Authentication API

A beginner-friendly backend authentication API built using Node.js, Express.js, SQLite, and bcrypt.

---

## Features

- User Registration
- User Login
- Change Password
- Password Hashing using bcrypt
- SQLite Database Integration

---

## Technologies Used

- Node.js
- Express.js
- SQLite
- bcrypt

---

## Project Structure

```bash
user-auth-api/
│
├── app.js
├── app.http
├── package.json
├── README.md
├── userData.db
```

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Run Server

```bash
node app.js
```

Server runs on:

```txt
http://localhost:3000
```

---

## API Testing

Use:
- REST Client extension in VS Code
- or Postman

Run server first before testing APIs.

---

## Register User

POST `/register`

Request Body:

```json
{
  "username": "praga",
  "name": "Pragatheesh",
  "password": "12345",
  "gender": "Male",
  "location": "Tamil Nadu"
}
```

Response:

```txt
User created successfully
```

---

## Login User

POST `/login`

Request Body:

```json
{
  "username": "praga",
  "password": "12345"
}
```

Response:

```txt
Login success!
```

---

## Change Password

PUT `/change-password`

Request Body:

```json
{
  "username": "praga",
  "oldPassword": "12345",
  "newPassword": "67890"
}
```

Response:

```txt
Password updated
```