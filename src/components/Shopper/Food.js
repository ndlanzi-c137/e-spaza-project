import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const Food = () => {
  const { category, shop } = useParams();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let foodQuery = collection(db, 'data');

      if (category) {
        foodQuery = query(foodQuery, where('category', '==', category));
      }

      if (shop) {
        foodQuery = query(foodQuery, where('shop', '==', shop));
      }

      const foodSnapshot = await getDocs(foodQuery);
      const foodList = foodSnapshot.docs.map(doc => doc.data());
      setFoods(foodList);
      setFilteredFoods(foodList);
    };

    fetchData();
  }, [category, shop]);

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Popular Products
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 200px))', gap: '24px', paddingTop: '16px', justifyContent: 'center' }}>
        {filteredFoods.map((item, index) => (
          <div key={index} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: 'bold' }}>{item.name}</p>
              <p><span style={{ backgroundColor: '#2ECC40', color: 'white', padding: '4px', borderRadius: '9999px' }}>{item.price}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
