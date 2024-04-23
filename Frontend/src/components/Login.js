import React, { useState } from 'react';
import './Login.css';
import googleIcon from '../icons/google.png';
import githubIcon from '../icons/github.png';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear previous errors
    
        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    console.log('Login successful:', data);
                    

                    if (data.user.role === 'shopper') {
                        navigate('/shopperdashboard'); // Navigate to shopper dashboard
                    } else if (data.user.role === 'staff') {
                        navigate('/staffdashboard'); // Navigate to staff dashboard
                    } else if(data.user.role === 'admin'){
                        navigate('/admindashboard'); // Navigate to admin dashboard
                    }
                    else {
                        throw new Error('Unknown role');
                    }
                    
                    // Redirect or manage the login state here
                } else {
                    throw new Error(data.message || 'Unable to login');
                }
            } else {
                throw new Error('Response is not in JSON format');
            }
        } catch (err) {
            setError(err.message);
            console.error('Login failed:', err);
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
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder="Enter your Email here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={handlePasswordChange} placeholder="Enter your Password here" />
                    </div>
                    <button type="submit" className="create-account">Login</button>
                    {error && <p className="error">{error}</p>}  {/* Display error message */}
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
