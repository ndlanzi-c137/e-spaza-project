import React, { useState } from 'react';
import './Signup.css';
import { auth, db } from '../firebaseConfig'; // Correct import path
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import googleIcon from '../icons/google.png';
import githubIcon from '../icons/github.png';
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => setter(e.target.value);

    const validatePassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userRef, { name, email, role });
            navigate('/'); // Navigate to home on successful sign up
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        }
    };

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userRef = doc(db, "users", result.user.uid);
            await setDoc(userRef, { name: result.user.displayName, email: result.user.email, role: 'shopper' }); // Default role as shopper for Google users
            navigate('/');
        } catch (error) {
            setError(error.message || "Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className="SignUp">
            <aside className="graphic-side">
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
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="full-name">Full Name</label>
                        <input type="text" id="full-name" value={name} onChange={handleInputChange(setName)} placeholder="Enter your Full Name here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={handleInputChange(setEmail)} placeholder="Enter your Email here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={handleInputChange(setPassword)} placeholder="Enter your Password here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" value={role} onChange={handleInputChange(setRole)}>
                            <option value="">Select Role</option>
                            <option value="shopper">Shopper</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="create-account">Create Account</button>
                    {error && <p className="error">{error}</p>}
                </form>
                <footer className="footer">
                    <p>Already have an account? <Link to="/">Login</Link></p>
                    <div className="divider">- OR -</div>
                    <div className="social-login">
                        <button className="social-button google" onClick={handleGoogleSignUp}>
                            <img src={googleIcon} alt="Sign up with Google" />
                            Sign up with Google
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
};

export default SignUp;
