import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {

    // const host = "http://localhost:5000"
    const host = "https://cloud-notebook-seven.vercel.app/"

    const [notes, setNotes] = useState([])

    // * Get all notes
    const getNotes = async () => {
        // API call
        const response = await fetch(
            `${host}/api/notes/fetchallnotes`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
        const json = await response.json();
        // console.log(json)
        setNotes(json)
    }

    // * Add a Note
    const addNote = async (title, description, tag) => {
        // API Call
        const response = await fetch(
            `${host}/api/notes/addnote`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });
        const json = await response.json();
        // console.log(json)
        // console.log(json)

        // console.log("Adding a new note")
        const note = json
        // setNotes(notes.push(note)) // pushes note in notes array
        setNotes(notes.concat(note)) // concats note in array and returns the new array
    }

    // * Delete a Note
    const deleteNote = async (id) => {
        // console.log("Deleting the note with id" + id)
        // TODO : API Call
        const response = await fetch(
            `${host}/api/notes/deletenote/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ id })
            });
        const json = await response.json();
        // console.log(json)

        // console.log("Deleting the note with id " + id)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }

    // * Edit a Note
    const editNote = async (id, title, description, tag) => {
        //  API Call
        const response = await fetch(
            `${host}/api/notes/updatenote/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });
        const json = await response.json();
        // console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes)) //* Deep copy
        // console.log("newNotes = ", newNotes)
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title
                newNotes[index].description = description
                newNotes[index].tag = tag
                break
            }
        }
        setNotes(newNotes)
    }

    return (
        <NoteContext.Provider value=
            {{
                notes: notes,
                getNotes,
                addNote,
                deleteNote,
                editNote
            }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;