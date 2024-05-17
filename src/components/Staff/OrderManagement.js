import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [shopId, setShopId] = useState(null);
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
          fetchOrders(userData.shopId);
        }
      }
    };

    const fetchOrders = async (shopId) => {
      const q = query(collection(db, 'orders'), where('shopId', '==', shopId));
      const ordersSnapshot = await getDocs(q);
      const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
    };

    fetchCurrentUser();
  }, [auth]);

  const completeOrder = async (orderId) => {
    const orderDoc = doc(db, 'orders', orderId);
    await updateDoc(orderDoc, { status: 'Completed' });
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Completed' } : order));
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Order Management
      </h1>
      <ul>
        {orders.map(order => (
          <li key={order.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {order.customer} - {order.status}
            {order.status === 'Pending' && (
              <button onClick={() => completeOrder(order.id)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Complete Order
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;
