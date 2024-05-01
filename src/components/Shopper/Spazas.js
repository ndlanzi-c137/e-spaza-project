import React, { useState } from 'react';
import { shops } from '../../data/data.js';

const Spazas = () => {
  const [foods, setFoods] = useState(shops);

  // Filter Type burgers/pizza/etc
  const filterType = (category) => {
    setFoods(
      shops.filter((item) => item.category === category)
    );
  };

  // Filter by price
  const filterPrice = (price) => {
    setFoods(
      shops.filter((item) => item.price === price)
    );
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Spaza Shops
      </h1>

      {/* Filter Row */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '16px' }}>


        {/* Filter Price */}
        <div>
          <p style={{ fontWeight: 'bold', color: '#000000' }}>Filter Price</p>
          <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '390px', width: '100%' }}>
          <button
              onClick={() => setFoods(shops)}
              style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              All
            </button>
            <button
              onClick={() => filterPrice('Low')}
              style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              Low
            </button>
            <button
              onClick={() => filterPrice('Medium')}
              style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              Medium
            </button>
            <button
              onClick={() => filterPrice('High')}
              style={{ margin: '4px', border: '1px solid #2ECC40', color: '#2ECC40', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              High
            </button>
          </div>
        </div>
      </div>

      {/* Display foods */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 200px))', gap: '24px', paddingTop: '16px', justifyContent: 'center' }}>
        {foods.map((item, index) => (
          <div
            key={index}
            style={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease', ':hover': { transform: 'scale(1.05)' } }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
            />
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: 'bold' }}>{item.name}</p>
              <p>
                <span style={{ backgroundColor: '#2ECC40', color: 'white', padding: '4px', borderRadius: '9999px' }}>
                  {item.price}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spazas;
