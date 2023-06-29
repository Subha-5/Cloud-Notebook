const mongoose = require('mongoose')

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/iNotebook'

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo successfully")
    })
}

module.exports = connectToMongo;