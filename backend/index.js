require('dotenv').config(); 
const express = require('express')
const connectToMongo = require('./db');
var cors = require('cors')


connectToMongo()

const app = express()
const port = process.env.PORT || 5000
app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers","Content-Type,Authorization");
  next();
});

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) =>
  res.send('Hello Coder!')
)

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})