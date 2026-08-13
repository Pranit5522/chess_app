import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();

    async function handleLogin() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
            email: (document.querySelector('input[type="email"]') as HTMLInputElement).value,
            password: (document.querySelector('input[type="password"]') as HTMLInputElement).value,
            }),
        });

        if (!response.ok) {
            alert("Login failed");
            return;
        }

        navigate("/game");
    }
    return (
        <div className="login-page">
            <div className="login-container">
                <img src="/chess_logo.png" alt="logo" className="logo" />

                <h3 className="title">Login to your account</h3>
                <p className="subtitle">Enter your email to sign in</p>

                <input type="email" placeholder="Email" className="input" />
                <input type="password" placeholder="Password" className="input" />

                <button className="continue-btn yellow-btn" onClick={handleLogin}>Continue</button>

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
                    Don&apos;t have an account?{" "}
                    <a href="/register">Register here</a>.
                </p>
            </div>
        </div>
    );
};
