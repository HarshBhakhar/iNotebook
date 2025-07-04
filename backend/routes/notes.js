const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const { route } = require('./auth');

// Get all notes; GET "/api/notes/getnote" . login required
router.get('/getnote', fetchuser ,async (req, res) => {
    try {
        const note = await Note.find({user: req.user.id})
        res.json(note)
    } catch (error) {
         console.log(error.message)
        res.status(500).send("internal server error")
    }

})
// Add a new notes: POST "/api/notes/addnotes" . login required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'description should be 5 character long').isLength({ min: 5 }),
], async (req, res) => {
    // if there are errors return bad request with error
    try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {title , description , tag} = req.body

    const note = new Note({
        title,description,tag,user : req.user.id
    })

    const saveNote = await note.save()
    res.json(saveNote)
            
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error")
    }
})


// Add a new notes: POST "/api/notes/addnotes" . login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title , description , tag} = req.body
    try {
        
    // create a new object
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    // find the note to be update and update it
    let note = await Note.findById(req.params.id)
    if(!note){
        return res.status(400).send("Not found")
    }
    
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
    res.json({note})
    
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error")
    }
})

// Delete a notes: DELETE "/api/notes/deletenotes" . login required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{

    try {
        
    
    // find the note to be update and update it
    let note = await Note.findById(req.params.id)
    if(!note){
        return res.status(400).send("Not found")
    }
    
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success" : "Note has been Deleted" , note:note})
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error")
    }
})

module.exports = router