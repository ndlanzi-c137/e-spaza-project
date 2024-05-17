import React, { useState } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', status: 'Pending' },
    { id: 2, customer: 'Jane Smith', status: 'Completed' }
  ]);

  const completeOrder = (orderId) => {
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
