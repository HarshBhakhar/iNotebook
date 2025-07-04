import React, { useContext } from 'react'
import noteContext from '../context/note/noteContext'

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deletenote } = context;
    const { note, updatenote } = props;
    const del = () => {
        deletenote(note._id)
    }
    return (
        <div className="col-md-4">
            <div className="card my-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title text-primary">{note.title}</h5>
                    <p className="card-text text-muted">{note.description}</p>

                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => {
                                del();
                                props.showAlert("Deleted Successfully", "success");
                            }}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>

                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => updatenote(note)}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        // <div className='col-md-3'>
        //     <div className="card my-3">
        //         <div className="card-body">
        //             <h5 className="card-title"> {note.title}</h5>
        //             <p className="card-text">{note.description}</p>
        //             {/* <i className="fa-solid fa-trash mx-2" onClick={()=>{deletenote(note._id)}}></i> */} {/* You can also write like this */}
        //             <i className="fa-solid fa-trash mx-2" onClick={() => {
        //                 del(); // delete item
        //                 props.showAlert("Deleted Successfully", "success"); // then show alert
        //             }}></i>
        //             <i className="fa-solid fa-pen-to-square mx-2" onClick={() => { updatenote(note) }}></i>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Noteitem
