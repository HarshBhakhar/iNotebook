import React, { useState } from 'react';

const ForgotPassword = ({ showAlert }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const json = await response.json();
            if (json.success) {
                showAlert("Reset link sent to your email (or check console)", "success");
                console.log("Reset token:", json.resetToken); // For testing
                setSuccess(true);
            } else {
                showAlert("Error: " + (json.error || "Email not found"), "danger");
            }
        } catch (err) {
            console.error(err);
            showAlert("Server error", "danger");
        }

        setLoading(false);
    };

    return (
        <div className="container my-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-3">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            {success && (
                <div className="alert alert-info mt-3">
                    If this email exists, a reset link was sent.
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
