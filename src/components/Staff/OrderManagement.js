import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [shopId, setShopId] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log('Fetching current user:', user.email);
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const userDoc = await getDocs(q);
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          console.log('Fetched user data:', userData);
          setShopId(userData.shopId);
          fetchOrders(userData.shopId);
        } else {
          console.log('No user document found.');
        }
      } else {
        console.log('No authenticated user found.');
      }
    };

    const fetchOrders = async (shopId) => {
      console.log('Fetching orders for shopId:', shopId);
      const q = query(collection(db, 'orders'), where('shopId', '==', shopId));
      const ordersSnapshot = await getDocs(q);
      const ordersList = await Promise.all(
        ordersSnapshot.docs.map(async orderDoc => {
          const orderData = orderDoc.data();
          const shopperDocRef = doc(db, 'users', orderData.shopperId);
          const shopperDoc = await getDoc(shopperDocRef);
          if (shopperDoc.exists()) {
            const shopperData = shopperDoc.data();
            console.log('Fetched shopper data:', shopperData);
            orderData.shopperName = shopperData.name;
          } else {
            console.log('No shopper document found for ID:', orderData.shopperId);
            orderData.shopperName = 'Unknown Shopper';
          }
          return { id: orderDoc.id, ...orderData };
        })
      );
      setOrders(ordersList);
      console.log('Fetched orders:', ordersList);
    };

    fetchCurrentUser();
  }, [auth]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderDoc = doc(db, 'orders', orderId);
    await updateDoc(orderDoc, { status: newStatus });
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Order Management
      </h1>
      <ul>
        {orders.map(order => (
          <li key={order.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            <h3>Customer: {order.shopperName}</h3>
            <p>Status: {order.status}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} units - R{item.price}
                </li>
              ))}
            </ul>
            <p>Total: R{order.total}</p>
            <div>
              {['pending', 'packing', 'ready-for-collection', 'collected', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(order.id, status)}
                  disabled={order.status === status}
                  style={{
                    marginLeft: '8px',
                    padding: '4px 8px',
                    backgroundColor: order.status === status ? '#ccc' : '#2ECC40',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: order.status === status ? 'default' : 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;
