require('dotenv').config(); 
const express = require('express')
const connectToMongo = require('./db');
var cors = require('cors')


connectToMongo()

const app = express()
const port = process.env.PORT || 5000
app.use(cors())

app.use(express.json())

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) =>
  res.send('Hello Coder!')
)

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})