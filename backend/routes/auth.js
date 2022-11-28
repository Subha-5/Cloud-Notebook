const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const fetchUser = require('../middleware/fetchUser')

const JWT_SECRET = 'coderisagood$oy'

// Route 1: Create a user using: POST "/api/auth/createuser". No login required 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters.').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    /* const user = User(req.body)
    user.save() */
    // Check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists." })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        // create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            // password: req.body.password
            password: secPass
        })
        /*.then(user => res.json(user))
            .catch(err => {
                console.log(err)
                res.json({
                    error: "Please enter a unique value for email.",
                    message: err.message
                })
            })*/

        // res.send(req.body)
        // res.json(user) // response ( ⚠️ sending all details back) 
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        // console.log(authToken)
        res.json({ authToken: authToken })
    }
    // catching error if something unexpected occurs
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

// Route 2: Authenticate a user using: POST "/api/auth/login". No login required 
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank.').exists(),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() });
    }
    // When proper email and passwords are provided by the user
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email })
        // in case, user does not exists in database
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }
        // in case, user exists on database
        const passwordCompare = await bcrypt.compare(password, user.password);
        // password does not match
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }
        // password matches and email found
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ authToken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

// Route 3: Get logged in user details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchUser,
    async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Internal Server error")
        }
    })


module.exports = router