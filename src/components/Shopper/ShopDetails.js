import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useStateValue } from './StateProvider.js';
import Navbar from './NavbarShopper'; // Adjust the import path as needed

const ShopDetails = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shopCategory, setShopCategory] = useState('');
  const [{ basket }, dispatch] = useStateValue();


  const styles = {
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#2ECC40',
      color: 'white',
    },
    buttonHover: {
      backgroundColor: '#28a745',
    },
  };


  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const shopsCollection = collection(db, 'shops');
        const shopQuery = query(shopsCollection, where('adminId', '==', shopId));
        const shopSnapshot = await getDocs(shopQuery);
        const shopData = shopSnapshot.docs[0]?.data();

        if (shopData) {
          setShopCategory(shopData.category);
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
      }
    };

    const initializeData = async () => {
      await fetchShopDetails();
    };

    initializeData();
  }, [shopId]);

  useEffect(() => {
    const fetchItems = async (category) => {
      try {
        const itemsCollection = collection(db, 'inventory');
        const itemsQuery = query(itemsCollection, where('shopCategory', '==', category));
        const itemsSnapshot = await getDocs(itemsQuery);
        const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (shopCategory) {
      fetchItems(shopCategory);
    }
  }, [shopCategory]);

  const addToCart = (id, title, image, price) => {
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
      },
    });
  };

  return (
    <div style={{ backgroundColor: '#fcf9f9' }}>
      <Navbar />
      <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
        <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
          Shop Items
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 200px))', gap: '24px', paddingTop: '16px', justifyContent: 'center' }}>
          {items.map((item, index) => (
            <div key={index} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
              <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                <p><span style={{ backgroundColor: '#2ECC40', color: 'white', padding: '4px', borderRadius: '9999px' }}>R{item.price}</span></p>
                <button
                  className='add__toCart'
                  style={{ marginTop: '50px', padding: '15px', color: 'white', backgroundColor: '#2ECC40', border: '1px', display: 'flex', alignItems: 'center', borderRadius: '10px' }}
                  onClick={() => addToCart(item.id, item.name, item.imageUrl, item.price)}
            
                  onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
