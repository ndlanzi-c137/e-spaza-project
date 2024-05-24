import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [shopId, setShopId] = useState(null);
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
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const userDoc = await getDocs(q);
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setShopId(userData.shopId);
          fetchShopDetails(userData.shopId);
          fetchInventory(userData.shopId);
        }
      }
    };

    const fetchShopDetails = async (shopId) => {
      const shopsCollection = collection(db, 'shops');
      const shopQuery = query(shopsCollection, where('adminId', '==', shopId));
      const shopSnapshot = await getDocs(shopQuery);
      const shopData = shopSnapshot.docs[0]?.data();
      if (shopData) {
        setShop(shopData);
      }
    };

    const fetchInventory = async (shopId) => {
      const q = query(collection(db, 'inventory'), where('shopId', '==', shopId));
      const inventorySnapshot = await getDocs(q);
      const inventoryList = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(inventoryList);
    };

    fetchCurrentUser();
  }, [auth]);

  const updateQuantity = async (itemId, newQuantity) => {
    const itemDoc = doc(db, 'inventory', itemId);
    await updateDoc(itemDoc, { quantity: newQuantity });
    setInventory(inventory.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
    toast.success(`Item quantity updated to ${newQuantity}`);
  };

  const handleAddItem = async () => {
    if (newItemName && newItemQuantity && newItemPrice && shopId && shop) {
      const newItem = {
        name: newItemName,
        quantity: parseInt(newItemQuantity, 10),
        price: parseFloat(newItemPrice),
        shopId: shopId,
        imageUrl: newItemImageUrl,
        shopCategory: shop.category
      };
      const docRef = await addDoc(collection(db, 'inventory'), newItem);
      setInventory([...inventory, { id: docRef.id, ...newItem }]);
      setNewItemName('');
      setNewItemQuantity('');
      setNewItemPrice('');
      setNewItemImageUrl('');
      toast.success(`Item ${newItemName} added successfully`);
    } else {
      console.log('Failed to add item. Missing required fields or shopId.');
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
            {item.name} - {item.quantity}
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
      <ToastContainer />
    </div>
  );
};

export default InventoryManagement;
