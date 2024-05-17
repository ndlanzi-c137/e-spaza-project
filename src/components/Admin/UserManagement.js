import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const addUser = async () => {
    const newUser = { name: `New User ${users.length + 1}`, role: 'Staff' };
    const userDoc = await addDoc(collection(db, 'users'), newUser);
    setUsers([...users, { id: userDoc.id, ...newUser }]);
  };

  const removeUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  const changeRole = async (userId, newRole) => {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, { role: newRole });
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        User Management
      </h1>
      <button onClick={addUser} style={{ margin: '8px', padding: '8px 16px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Add User
      </button>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {user.name} - {user.role}
            <button onClick={() => changeRole(user.id, user.role === 'Staff' ? 'Admin' : 'Staff')} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Change Role
            </button>
            <button onClick={() => removeUser(user.id)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
