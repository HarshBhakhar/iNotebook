import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {


    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate()
    const { name, email, password } = credential
    const handlesubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, password: password })
        })

        const json = await response.json()
        if (json.success) {
            // save and redirect
            localStorage.setItem('token', json.authToken)
            navigate("/")
            props.showAlert("Logged in successfully", "success")


        } else {
            props.showAlert("Invalid Details", "danger")

        }
    }
    const change = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
    return (
        <div className='my-3'>
            <form onSubmit={handlesubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" value={credential.name} id="name" onChange={change} name='name' aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credential.email} id="email" onChange={change} name='email' aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credential.password} onChange={change} id="password" name='password' minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="c password" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" value={credential.cpassword} onChange={change} id="cpassword" name='cpassword' minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )


}

export default Signup
