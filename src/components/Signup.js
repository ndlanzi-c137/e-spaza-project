import React, { useState } from 'react';
import './Signup.css';
import googleIcon from '../icons/google.png'; // Make sure you have the icons in your project directory
import githubIcon from '../icons/github.png';
import { Link } from "react-router-dom"

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your signup logic here
    };

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

        <div className="SignUp">
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
            <h1>Create your Free Account</h1>
            </header>
            <form className="sign-up-form">
            <div className="input-group">
                <label htmlFor="full-name">Full Name</label>
                <input type="text" id="full-name" placeholder="Enter your Full Name here" />
            </div>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your Email here" />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your Password here" />
                <select id="toggle-option">
                <option value="war">Select Role</option>
                <option value="war">Shopper</option>
                <option value="door">Staff</option>
                <option value="shoot">Admin</option>
                </select>
            </div>
            <button type="submit" className="create-account">Create Account</button>
            </form>
            <footer className="footer">
            <p>Already have an account?  <Link to="/">Login</Link> </p>
            <div className="divider">- OR -</div>
            <div className="social-login">
                <button className="social-button google">
                <img src={googleIcon} alt="Sign up with Google" />
                Sign up with Google
                </button>
                <button className="social-button github">
                <img src={githubIcon} alt="Sign up with GitHub" />
                Sign up with GitHub
                </button>
            </div>
            </footer>
        </section>
        </div>
    );
};

export default SignUp;