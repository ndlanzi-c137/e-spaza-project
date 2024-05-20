import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [shop, setShop] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
        const userDoc = await getDocs(userQuery);
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          if (userData.shopId) {
            fetchShopDetails(userData.shopId);
          } else {
            console.log('User has no shopId.');
          }
        } else {
          console.log('No user document found.');
        }
      }
    };

    const fetchShopDetails = async (shopId) => {
      const shopDocRef = doc(db, 'shops', shopId);
      const shopDoc = await getDoc(shopDocRef);
      if (shopDoc.exists()) {
        const shopData = shopDoc.data();
        setShop(shopData);
        fetchInventory(shopId);
      } else {
        console.log('No shop document found.');
      }
    };

    const fetchInventory = async (shopId) => {
      const inventoryQuery = query(collection(db, 'inventory'), where('shopId', '==', shopId));
      const inventorySnapshot = await getDocs(inventoryQuery);
      const inventoryList = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(inventoryList);
    };

    fetchCurrentUser();
  }, [auth]);

  const updateQuantity = async (itemId, newQuantity) => {
    const itemDoc = doc(db, 'inventory', itemId);
    await updateDoc(itemDoc, { quantity: newQuantity });
    setInventory(inventory.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const handleAddItem = async () => {
    if (newItemName && newItemQuantity && newItemPrice && shop) {
      const newItem = {
        name: newItemName,
        quantity: parseInt(newItemQuantity, 10),
        price: parseFloat(newItemPrice),
        shopId: shop,
        imageUrl: newItemImageUrl
      };
      const docRef = await addDoc(collection(db, 'inventory'), newItem);
      setInventory([...inventory, { id: docRef.id, ...newItem }]);
      setNewItemName('');
      setNewItemQuantity('');
      setNewItemPrice('');
      setNewItemImageUrl('');
    }
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Inventory Management
      </h1>
      {shop && (
        <div>
          <h2>Shop: {shop.name}</h2>
          <h3>Category: {shop.category}</h3>
        </div>
      )}
      <ul>
        {inventory.map(item => (
          <li key={item.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {item.name} - {item.quantity} units - R{item.price}
            <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))} style={{ marginLeft: '8px', padding: '4px', border: '1px solid #2ECC40', borderRadius: '4px' }} />
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '16px' }}>
        <h2>Add New Item</h2>
        <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Item Name" style={{ marginRight: '8px' }} />
        <input type="number" value={newItemQuantity} onChange={(e) => setNewItemQuantity(e.target.value)} placeholder="Quantity" style={{ marginRight: '8px' }} />
        <input type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} placeholder="Price" step="0.01" style={{ marginRight: '8px' }} />
        <input type="text" value={newItemImageUrl} onChange={(e) => setNewItemImageUrl(e.target.value)} placeholder="Image URL" style={{ marginRight: '8px' }} />
        <button onClick={handleAddItem} style={{ padding: '8px 16px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Item
        </button>
  
      </div>
    </div>
  );
};

export default InventoryManagement;
