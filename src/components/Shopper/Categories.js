import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Category = () => {
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

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '0 4px 12px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Categories
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '24px', padding: '10px 0', justifyContent: 'center', transition: 'transform 0.3s ease' }}>
        {categories.map((item, index) => (
          <div key={index} onClick={() => handleCategoryClick(item.name)} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <img src={item.image} alt={item.name} style={{ width: '80px', marginBottom: '8px' }} />
            <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#000000', textAlign: 'center' }}>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
