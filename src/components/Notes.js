import React, { useState, useContext, useEffect, useRef } from 'react'
import AddNote from './AddNote';
import NoteItem from './NoteItem';
import noteContext from "../context/notes/noteContext"
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext)
    const { notes, getNotes, editNote } = context;
    let navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('token')){
            getNotes()
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null)
    
    const [note, setNote] = useState(
        {
            id: "",
            etitle: "",
            edescription: "",
            etag: ""
        }
    )
    const updateNote = (currentNote) => {
        ref.current.click()
        setNote(
            {
                id: currentNote._id,
                etitle: currentNote.title,
                edescription: currentNote.description,
                etag: currentNote.tag
            }
        )
    }

    
    const handleClick = (e) => {
        // e.preventDefault();
        // console.log("Updating the note...", note)
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        props.showAlert("Updated successfully", "success")
    }
    const onChange = (event) => {
        setNote(
            {
                ...note,
                [event.target.name]: event.target.value
            }
        )
    }

    return (
        <>
            <AddNote showAlert={props.showAlert}/>

            <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#editModal" ref={ref} >
                Edit Note Modal
            </button>
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="" onChange={onChange} minLength={3} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <textarea type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} aria-describedby="" onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger align-items-left" data-bs-dismiss="modal" ref={refClose}>Close</button>
                            <button type="button" className="btn btn-success" onClick={handleClick} disabled={note.etitle.length < 3 || note.edescription.length < 5}> Update Note </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {notes.length === 0 && "No Notes to display"}
                </div>
                {
                    notes.map((note) => {
                        return <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} />
                    })
                }
            </div>
        </>
    )
}

export default Notes