const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    let obj = {
        a: 'auth',
        number: 4
    }
    res.json(obj)
})

module.exports = router