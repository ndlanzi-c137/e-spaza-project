<<<<<<< HEAD
import React from "react";
import { categories } from "../../data/data.js";
=======
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
      setCategories(categoriesList);
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };
>>>>>>> 258941d227436367138f28f3f837cb35b4b9b135

  return (
<<<<<<< HEAD
    <div style={{ maxWidth: "1640px", margin: "auto", padding: "0 4px 12px" }}>
      <h1
        style={{
          color: "#2ECC40",
          fontWeight: "bold",
          fontSize: "2.5rem",
          textAlign: "center",
        }}
      >
        Categories
      </h1>
      {/* Categories */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "24px",
          padding: "10px 0",
          justifyContent: "center",
          transition: "transform 0.3s ease",
          ":hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        {categories.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              flexDirection: "column", // Adjust direction to stack items vertically
              alignItems: "center", // Align items to the center
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "80px", marginBottom: "8px" }}
            />
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: "#000000",
                textAlign: "center", // Center-align the text
              }}
            >
              {item.name}
            </h2>
=======
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Categories
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', padding: '10px 0', justifyContent: 'center', transition: 'transform 0.3s ease' }}>
        {categories.map((item, index) => (
          <div key={index} onClick={() => handleCategoryClick(item.name)} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }}>
            <img src={item.image} alt={item.name} style={{ width: '80px', marginBottom: '8px' }} />
            <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#000000', textAlign: 'center' }}>{item.name}</h2>
>>>>>>> 258941d227436367138f28f3f837cb35b4b9b135
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
