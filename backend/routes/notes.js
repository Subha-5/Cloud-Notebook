const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes', fetchUser,
    async (req, res) => {
        try {
            const notes = await Note.find({ user: req.user.id })
            res.json(notes)
        } catch (err) {
            res.status(500).send("Internal Server error")
        }
    })

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchUser,
    [
        body('title', 'Enter a title').isLength({ min: 3 }),
        body('description', 'Description must be atleast 5 characters.').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title,
                description,
                tag,
                user: req.user.id
            })
            const savedNote = await note.save()
            res.json(savedNote)
        } catch (error) {
            res.status(500).send("Internal Server error")
        }
    })

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchUser,
    async (req, res) => {
        try {
            const {title, description, tag} = req.body;
            // create a newNote object
            const newNote = {};
            if(title){ newNote.title = title}
            if(description){ newNote.description = description}
            if(tag){ newNote.tag = tag}

            // Find the note to be updated and update it
            let note = await Note.findById(req.params.id);
            if(!note){ return res.status(404).send("Not Found")}

            if(note.user.toString() !== req.user.id){ return res.status(401).send("Not allowed")}

            note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
            res.json({note})

        } catch (error) {
            res.status(500).send("Internal Server error")
        }
    })
    
// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchUser,
    async (req, res) => {
        try {
            // Find the note to be deleted and delete it
            let note = await Note.findById(req.params.id);
            if(!note){ return res.status(404).send("Not Found")}

            // Allow deletion only if users owns this Note
            if(note.user.toString() !== req.user.id){ return res.status(401).send("Not allowed")}

            note = await Note.findByIdAndDelete(req.params.id)
            res.json({"Success": "Note has been deleted.", note: note})

        } catch (error) {
            res.status(500).send("Internal Server error")
        }
    })


module.exports = router