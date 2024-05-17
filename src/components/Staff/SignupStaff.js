import React, { useState, useEffect } from 'react';
import '../Signup.css';
import { auth, db } from '../../firebaseConfig'; // Correct import path
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignupStaff = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shopId, setShopId] = useState('');
    const [shops, setShops] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            const shopsCollection = collection(db, 'shops');
            const shopsSnapshot = await getDocs(shopsCollection);
            const shopsList = shopsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShops(shopsList);
        };

        fetchShops();
    }, []);

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

            // Create user document
            await setDoc(doc(db, 'users', user.uid), {
                id: newId,
                name,
                email,
                role: 'staff',
                shopId
            });

            navigate('/staffdashboard'); // Navigate to staff dashboard on successful sign up
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
                    <h1>Create your Staff Account</h1>
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
                        <label htmlFor="shop-id">Select Shop</label>
                        <select id="shop-id" value={shopId} onChange={handleInputChange(setShopId)}>
                            <option value="">Select a Shop</option>
                            {shops.map(shop => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="create-account">Create Account</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </section>
        </div>
    );
};

export default SignupStaff;
