import React, { useState } from 'react';
import './Signup.css';
import googleIcon from '../icons/google.png'; // Make sure you have the icons in your project directory
import githubIcon from '../icons/github.png';
import { Link,useNavigate } from "react-router-dom"

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');  // Assuming 'role' is required
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Password validation rules
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/'); // Redirect to login page or another page on successful sign up
            } else {
                throw new Error(data.message || 'Unable to sign up');
            }
        } catch (err) {
            setError(err.message);
            console.error('Signup failed:', err);
        }
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
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="full-name">Full Name</label>
                        <input type="text" id="full-name" value={name} onChange={handleNameChange} placeholder="Enter your Full Name here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder="Enter your Email here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={handlePasswordChange} placeholder="Enter your Password here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" value={role} onChange={handleRoleChange}>
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