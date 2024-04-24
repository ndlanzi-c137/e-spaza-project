import React, { useState } from 'react';
import './Login.css';
import googleIcon from '../icons/google.png'; // Make sure you have the icons in your project directory
import githubIcon from '../icons/github.png';
import { Link } from "react-router-dom"

const Login = () => {


    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const handleEmailChange = (e) => {
    //     setEmail(e.target.value);
    // };

    // const handlePasswordChange = (e) => {
    //     setPassword(e.target.value);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Add your Login logic here
    // };

    return (
     
        // <div>
        //     <h2>Sign Up</h2>
        //     <form onSubmit={handleSubmit}>
        //         <label>Email:</label>
        //         <input type="email" value={email} onChange={handleEmailChange} />

        //         <label>Password:</label>
        //         <input type="password" value={password} onChange={handlePasswordChange} />

        //         <button type="submit">Sign Up</button>
        //     </form>
        // </div>

        <div className="Login">
        <aside className="graphic-side">
            {/* Include any graphics or images here */}
            <div className="overlap">
                <img className="blobs-vector" alt="Blobs vector" src="/iconz/blobsvector.svg" />
                <img className="img" alt="Blobs vector" src="/iconz/blobsvector-2.svg" />
                <img className="blobs-vector-2" alt="Blobs vector" src="/iconz/blobsvector-3.svg" />
                <img className="ellipse" alt="Ellipse" src="ellipse-1.png" />
            </div>
        </aside>

        <section className="form-side">
            <header className="header">
            <h1>Login</h1>
            </header>
            <form className="sign-up-form">
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your Email here" />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your Password here" />
            </div>
            <button type="submit" className="create-account">Login</button>
            </form>
            <footer className="footer">
           
            <p>Don't have an account Yet ?  <Link to="/signup">Signup</Link> </p>
            <div className="divider">- OR -</div>
            <div className="social-login">
                <button className="social-button google">
                <img src={googleIcon} alt="Sign up with Google" />
                Sign in with Google
                </button>
                <button className="social-button github">
                <img src={githubIcon} alt="Sign up with GitHub" />
                Sign in with GitHub
                </button>
            </div>
            </footer>
        </section>
        </div>
    );
};

export default Login;