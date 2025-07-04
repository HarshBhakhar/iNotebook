import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credential, setCredential] = useState({ email: "", password: "" });
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credential.email, password: credential.password })
        });

        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully", "success");
            navigate("/");
        } else {
            props.showAlert("Invalid Details", "danger");
        }
    };

    const handleForgotPassword = async () => {
        if (!resetEmail) return;

        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: resetEmail })
            });

            const json = await res.json();
            if (json.success) {
                props.showAlert("Reset link sent to email", "success");
            } else {
                props.showAlert(json.error || "Error sending reset link", "danger");
            }
        } catch (error) {
            console.error(error);
            props.showAlert("Server error", "danger");
        }

        setShowForgot(false);
        setResetEmail("");
    };

    const change = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    };

    return (
        <div className="container my-5 d-flex justify-content-center">
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={credential.email}
                            onChange={change}
                            placeholder="Enter your email"
                            required
                        />
                        <div className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={credential.password}
                            onChange={change}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                            style={{ color: 'blue', cursor: 'pointer', fontSize: '0.9rem' }}
                            onClick={() => setShowForgot(true)}
                        >
                            Forgot Password?
                        </span>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>

            {/* Forgot Password Modal */}
            {showForgot && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-3">
                            <h5>Reset Password</h5>
                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Enter your registered email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-secondary me-2" onClick={() => setShowForgot(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleForgotPassword}>Send Link</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
