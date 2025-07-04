import React, { useContext, useState } from 'react'
import noteContext from '../context/note/noteContext'

const Addnote = (props) => {
    const context = useContext(noteContext);
    const { notes, addnote } = context;


    const [note, setnote] = useState({ title: "", desc: "", tag: "" })
    const handleClick = (e) => {
        e.preventDefault()
        addnote(note.title, note.desc, note.tag)
        setnote({ title: "", desc: "", tag: "" })
        props.showAlert("Note Added Successfully", "success")
    }
    const change = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <div className="container my-5">
                <h2 className="text-center mb-4">Add a New Note</h2>

                <div className="card shadow-sm p-4">
                    <form className="needs-validation" noValidate>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label fw-bold">Title</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                id="title"
                                name="title"
                                value={note.title}
                                onChange={change}
                                required
                            />
                            <div className="form-text text-muted">Minimum 3 characters</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label fw-bold">Description</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                id="desc"
                                name="desc"
                                value={note.desc}
                                onChange={change}
                                required
                            />
                            <div className="form-text text-muted">Minimum 5 characters</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tag" className="form-label fw-bold">Tag</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                id="tag"
                                name="tag"
                                value={note.tag}
                                onChange={change}
                            />
                            <div className="form-text text-muted">Optional: e.g. Work, Personal</div>
                        </div>

                        <div className="text-end">
                            <button
                                disabled={note.title.length < 3 || note.desc.length < 5}
                                type="submit"
                                className="btn btn-primary px-4"
                                onClick={handleClick}
                            >
                                Add Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* <div className="container my-3">
                <h1>Add Note</h1>
                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={change}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
                        <input type="text" className="form-control" id="desc" name="desc" value={note.desc} onChange={change}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag"  value={note.tag} name="tag" onChange={change}/>
                    </div>
                    <button disabled={note.title.length < 3 || note.desc.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div> */}
        </div>
    )
}

export default Addnote
