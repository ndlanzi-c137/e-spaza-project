import React, { useState } from 'react';
import './Login.css';
import { auth, db } from '../firebaseConfig'; // Ensure the correct path
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from '../icons/google.png';
import githubIcon from '../icons/github.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigateBasedOnRole(userCredential.user.uid);
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            navigateBasedOnRole(result.user.uid);
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
        }
    };

    const navigateBasedOnRole = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const { role } = docSnap.data();
                switch (role) {
                    case 'shopper':
                        navigate('/shopperdashboard');
                        break;
                    case 'staff':
                        navigate('/staffdashboard');
                        break;
                    case 'admin':
                        navigate('/admindashboard');
                        break;
                    default:
                        throw new Error('Unknown role');
                }
            } else {
                throw new Error('User data not found');
            }
        } catch (err) {
            setError('Error determining user role. Please contact support.');
        }
    };

    return (
        <div className="Login">
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
                    <h1>Login</h1>
                </header>
                <form className="sign-up-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder="Enter your Email here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={handlePasswordChange} placeholder="Enter your Password here" />
                    </div>
                    <button type="submit" className="create-account">Login</button>
                    {error && <p className="error">{error}</p>}
                </form>
                <footer className="footer">
                    <p>Don't have an account yet? <Link to="/signup">Signup</Link></p>
                    <div className="divider">- OR -</div>
                    <div className="social-login">
                        <button className="social-button google" onClick={handleGoogleSignIn}>
                            <img src={googleIcon} alt="Sign in with Google" />
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
