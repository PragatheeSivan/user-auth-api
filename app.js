const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const bcrypt = require('bcrypt')

const dbPath = path.join(__dirname, 'userData.db')

const app = express()
app.use(express.json())

let db = null

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Iniya Thodakkam')
    })
  } catch (e) {
    console.log(`Error ${e.message}`)
    process.exit(1)
  }
}

initializeDBandServer()

app.post('/register', async (request, response) => {
  const {username, name, password, gender, location} = request.body

  if (password.length < 5) {
    return response.status(400).send('Password is too short')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const selectQuery = `
  SELECT *
  FROM user
  WHERE username = ?;`

  const usernameAuth = await db.get(selectQuery, [username])

  if (usernameAuth === undefined) {
    const insertQuery = `
      INSERT INTO user (username ,name  ,password ,gender , location )
      VALUES (?,?,?,?,?);`

    await db.run(insertQuery, [
      username,
      name,
      hashedPassword,
      gender,
      location,
    ])
    response.send('User created successfully')
  } else {
    response.status(400)
    response.send('User already exists')
  }
})

app.post('/login', async (request, response) => {
  const {username, password} = request.body

  const selectQuery = `
  SELECT *
  FROM user
  WHERE username = ?;`

  const user = await db.get(selectQuery, [username])

  if (user === undefined) {
    return response.status(400).send('Invalid user')
  }

  const passwordIsMatched = await bcrypt.compare(password, user.password)

  if (passwordIsMatched) {
    response.send('Login success!')
  } else {
    response.status(400).send('Invalid password')
  }
})

app.put('/change-password', async (request, response) => {
  const {username, oldPassword, newPassword} = request.body

  try {
    const oPassword = `
  SELECT *
  FROM user
  WHERE username = ?;`

    const user = await db.get(oPassword, [username])

    if (!user) {
      return response.status(400).send('User not found')
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

    if (!isPasswordCorrect) {
      return response.status(400).send('Invalid current password')
    }
    if (newPassword.length < 5) {
      return response.status(400).send('Password is too short')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updateQuery = `
      UPDATE user
      SET password = ?
      WHERE username = ?;`

    await db.run(updateQuery, [hashedPassword, username])

    response.status(200).send('Password updated')
  } catch (error) {
    console.error(error)
    response.status(500).send('Internal Server Error')
  }
})

module.exports = app
