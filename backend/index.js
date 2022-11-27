const express = require('express')
const connectToMongo = require('./db');

connectToMongo()

const app = express()
const port = 5000

app.use(express.json())

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) =>
  res.send('Hello Coder!')
)

app.listen(port, () => {
  console.log(`Your app listening on port ${port}`)
})