import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister() {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            alert(data?.message || "Registration failed");
            return;
        }

        navigate("/login");
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <img src="/chess_logo.png" alt="logo" className="logo" />

                <h3 className="title">Create your account</h3>
                <p className="subtitle">Enter your details to sign up</p>

                <input type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button className="continue-btn yellow-btn" onClick={handleRegister}>Continue</button>

                <div className="separator">
                    <span>or</span>
                </div>

                <div className="oauth-space"></div>

                <p className="tos">
                    By clicking continue, you agree to our{" "}
                    <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>.
                </p>

                <p className="tos">
                    Already have an account?{" "}
                    <a href="/login">Login here</a>.
                </p>
            </div>
        </div>
    );
};
