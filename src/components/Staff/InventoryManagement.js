import React, { useState } from 'react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Apples', quantity: 10 },
    { id: 2, name: 'Bananas', quantity: 5 }
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    setInventory(inventory.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Inventory Management
      </h1>
      <ul>
        {inventory.map(item => (
          <li key={item.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {item.name} - {item.quantity}
            <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))} style={{ marginLeft: '8px', padding: '4px', border: '1px solid #2ECC40', borderRadius: '4px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManagement;
