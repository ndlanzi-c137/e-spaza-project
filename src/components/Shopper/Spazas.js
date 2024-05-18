import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Spazas = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const navigate = useNavigate();

  const categoryMap = {
    'mini-supermarket': 'MSM',
    'fast-food': 'FF',
    'tuck-shop': 'TS',
    'Spaza': 'Spaza' // Add this if you have a category called 'Spaza'
  };

  useEffect(() => {
    const fetchData = async () => {
      const shopsCollection = collection(db, 'shops');
      const shopsSnapshot = await getDocs(shopsCollection);
      const shopsList = shopsSnapshot.docs.map(doc => doc.data());
      setShops(shopsList);
      setFilteredShops(shopsList);
    };

    fetchData();
  }, []);

  const handleShopClick = (shopName) => {
    navigate(`/shop/${shopName}`);
  };

  const filterType = (category) => {
    setFilteredShops(shops.filter((item) => item.category === category));
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Spaza Shops
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <p style={{ fontWeight: 'bold', color: '#000000' }}>Filter Price</p>
          <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '390px', width: '100%' }}>
            <button onClick={() => setFilteredShops(shops)} style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}>All</button>
            <button onClick={() => filterType('mini-supermarket')} style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}>Mini-Supermarket</button>
            <button onClick={() => filterType('fast-food')} style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}>Fast-Food</button>
            <button onClick={() => filterType('tuck-shop')} style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}>Tuck-Shop</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 200px))', gap: '24px', paddingTop: '16px', justifyContent: 'center' }}>
        {filteredShops.map((item, index) => (
          <div key={index} onClick={() => handleShopClick(item.name)} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: 'bold' }}>{item.name}</p>
              <p><span style={{ backgroundColor: '#2ECC40', color: 'white', padding: '4px', borderRadius: '9999px' }}>{categoryMap[item.category]}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spazas;
