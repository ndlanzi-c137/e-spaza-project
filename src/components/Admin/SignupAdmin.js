import React, { useState } from 'react';
import '../Signup.css';
import { auth, db } from '../../firebaseConfig'; // Correct import path
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const SignupAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shopName, setShopName] = useState('');
    const [shopCategory, setShopCategory] = useState('');
    const [shopImage, setShopImage] = useState('');
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
            const user = userCredential.user;

            // Fetch and increment the current highest id
            const counterRef = doc(db, 'counters', 'userCounter');
            const counterSnap = await getDoc(counterRef);
            let newId = 1;
            if (counterSnap.exists()) {
                newId = counterSnap.data().currentId + 1;
                await updateDoc(counterRef, { currentId: newId });
            } else {
                await setDoc(counterRef, { currentId: newId });
            }

            // Create shop document
            await setDoc(doc(db, 'shops', user.uid), {
                name: shopName,
                category: shopCategory,
                image: shopImage,
                adminId: user.uid
            });

            // Create user document
            await setDoc(doc(db, 'users', user.uid), {
                id: newId,
                name,
                email,
                role: 'admin',
                shopId: user.uid
            });

            navigate('/admindashboard'); // Navigate to admin dashboard on successful sign up
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
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
                    <h1>Create your Admin Account</h1>
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
                        <label htmlFor="shop-name">Shop Name</label>
                        <input type="text" id="shop-name" value={shopName} onChange={handleInputChange(setShopName)} placeholder="Enter your Shop Name here" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="shop-category">Shop Category</label>
                        <select id="shop-category" value={shopCategory} onChange={handleInputChange(setShopCategory)}>
                            <option value="">Select Category</option>
                            <option value="mini-supermarket">mini-supermarket</option>
                            <option value="fast-food">fast-food</option>
                            <option value="tuck-shop">tuck-shop</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="shop-image">Shop Image URL</label>
                        <input type="text" id="shop-image" value={shopImage} onChange={handleInputChange(setShopImage)} placeholder="Enter your Shop Image URL here" />
                    </div>
                    <button type="submit" className="create-account">Create Account</button>
                    {error && <p className="error">{error}</p>}
                </form>
                <footer className="footer">
                    <p>Already have an account? <Link to="/">Login</Link></p>
                </footer>
            </section>
        </div>
    );
};

export default SignupAdmin;
