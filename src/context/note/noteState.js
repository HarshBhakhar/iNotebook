import { useState } from "react";
import NoteContext from "./noteContext";


const NoteState = (props) => {
    const host = "http://localhost:5000";
    const noteInitial = []
    const [notes, setNotes] = useState(noteInitial)

    // get all notes
    const fetchnote = async () => {
        const response = await fetch(`${host}/api/notes/getnote`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }

        })
        const json = await response.json()
        // setNotes(json)

        if (Array.isArray(json)) {
            setNotes(json);
        } else if (Array.isArray(json.notes)) {
            setNotes(json.notes);
        } else {
            setNotes([]); // fallback to avoid crash
        }
    }
    // Add note
    const addnote = async (title, desc, tag) => {

        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description: desc, tag })
        })
        const note = await response.json()
        setNotes(notes.concat(note))
    }

    // Delete note
    const deletenote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });

        const json = await response.json();
        if (json.success) {
            const del = notes.filter((note) => note._id !== id);
            setNotes(del);
        } else {
            console.error("Delete failed:", json.error);
        }
    }

    // Update note
    const editnote = async (id, title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get raw response body
                console.error("Failed to update note:", errorText);
                return;
            }

            const json = await response.json(); // parse only if valid
            console.log("Server response:", json);

            let newNotes = JSON.parse(JSON.stringify(notes));
            for (let index = 0; index < newNotes.length; index++) {
                const element = newNotes[index];
                if (element._id === id) {
                    newNotes[index].title = title;
                    newNotes[index].description = description;
                    newNotes[index].tag = tag;
                    break;
                }
            }
            setNotes(newNotes);
        } catch (error) {
            console.error("Network or parsing error:", error);
        }
    };


    return (
        <NoteContext.Provider value={{ notes, addnote, editnote, deletenote, fetchnote }}>
            {props.children}
        </NoteContext.Provider>
    )
}


export default NoteState; 