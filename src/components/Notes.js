import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/note/noteContext'
import Noteitem from './Noteitem';
import Addnote from './Addnote';
import { useNavigate } from 'react-router-dom';



const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, fetchnote, editnote } = context;
    let navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchnote();
        } else {
            navigate("/login")
        }
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null)

    const [note, setnote] = useState({ etitle: "", edescription: "", etag: "" })

    const updatenote = (curr) => {
        ref.current.click()
        setnote({ id: curr._id, etitle: curr.title, edescription: curr.description, etag: curr.tag })

    }

    const handleClick = (e) => {
        editnote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        props.showAlert("Updated Successfully", "success")
    }
    const change = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <Addnote showAlert={props.showAlert} />

            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Update Notes</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={change} value={note.etitle} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={change} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" onChange={change} value={note.etag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h1>Your Notes</h1>
                <div className="container mx-2">
                    {notes.length === 0 && "Add some notes"}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} note={note} updatenote={updatenote} showAlert={props.showAlert} />
                })}
            </div>
        </>
    )
}

export default Notes
