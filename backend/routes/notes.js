const express = require("express")
const router = express.Router();
var fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator')


router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error occured")
    }

})
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {
    console.log(req.body)
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        console.log(title, description, tag)
        const note = await Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.status(200).send(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error occured")
    }

})


router.put('/updatenote/:id', fetchuser, async (req, res) => {
    console.log(req.body)
    try {
        const { title, description, tag } = req.body;
        const newNote = {}
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag} 
         
        var note = await Note.findById(req.params.id)
        if(!note){ return res.status(400).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }
         note = await Note.findByIdAndUpdate(req.params.id ,{$set:newNote},{new:true})
        res.status(200).send({note})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error occured")
    }

})

router.delete('/deletenote/:id', fetchuser,  async (req, res) => {
    console.log(req.body)
    try {
        var note = await Note.findById(req.params.id)
        if(!note){ return res.status(400).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }
         note = await Note.findByIdAndDelete(req.params.id)
        res.status(200).send({"Success":"Note has been deleted"})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error occured")
    }

})

module.exports = router