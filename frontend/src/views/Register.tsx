export const Register = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <img src="/chess_logo.png" alt="logo" className="logo" />

                <h3 className="title">Create your account</h3>
                <p className="subtitle">Enter your details to sign up</p>

                <input type="email" placeholder="Email" className="input" />
                <input type="password" placeholder="Password" className="input" />
                <input type="password" placeholder="Confirm Password" className="input" />

                <button className="continue-btn yellow-btn">Continue</button>

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
