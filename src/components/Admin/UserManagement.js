import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const UserManagement = () => {
  const [users, setUsers] = useState({ staff: [], shoppers: [] });
  const [shop, setShop] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log('Current user email:', user.email);
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const userDoc = await getDocs(q);
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          console.log('Fetched user data:', userData);
          const shopQuery = query(collection(db, 'shops'), where('adminId', '==', user.uid));
          const shopDoc = await getDocs(shopQuery);
          if (!shopDoc.empty) {
            const shopData = shopDoc.docs[0].data();
            console.log('Fetched shop data:', shopData);
            setShop(shopData);
            setIsAdmin(userData.role === 'admin');
            fetchUsers(shopData.adminId);
            fetchShoppers(); // Fetch all shoppers separately
          } else {
            console.log('No shop found for this admin.');
          }
        } else {
          console.log('No user document found.');
        }
      }
    };

    const fetchUsers = async (adminId) => {
      console.log('Fetching staff members for adminId:', adminId);
      const q = query(collection(db, 'users'), where('shopId', '==', adminId), where('role', '==', 'staff'));
      const usersSnapshot = await getDocs(q);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched staff members:', usersList);
      setUsers(prevUsers => ({ ...prevUsers, staff: usersList }));
    };

    const fetchShoppers = async () => {
      console.log('Fetching all shoppers');
      const q = query(collection(db, 'users'), where('role', '==', 'shopper'));
      const shoppersSnapshot = await getDocs(q);
      const shoppersList = shoppersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched shoppers:', shoppersList);
      setUsers(prevUsers => ({ ...prevUsers, shoppers: shoppersList }));
    };

    fetchCurrentUser();
  }, [auth]);

  const addUser = async () => {
    if (!shop || !isAdmin) return;
    const newUser = { email: `user${users.staff.length + 1}@gmail.com`, name: `New User ${users.staff.length + 1}`, role: 'staff', shopId: shop.adminId };
    const userDoc = await addDoc(collection(db, 'users'), newUser);
    setUsers({ ...users, staff: [...users.staff, { id: userDoc.id, ...newUser }] });
  };

  const removeUser = async (userId) => {
    if (!isAdmin) return;
    await deleteDoc(doc(db, 'users', userId));
    setUsers({
      staff: users.staff.filter(user => user.id !== userId),
      shoppers: users.shoppers.filter(user => user.id !== userId)
    });
  };

  const changeRole = async (userId, newRole) => {
    if (!isAdmin) return;
    const userDocRef = doc(db, 'users', userId); // Ensure userId is passed correctly
    await updateDoc(userDocRef, { role: newRole });
    setUsers(prevUsers => ({
      staff: prevUsers.staff.map(user => user.id === userId ? { ...user, role: newRole } : user),
      shoppers: prevUsers.shoppers.map(user => user.id === userId ? { ...user, role: newRole } : user)
    }));
  };

  if (!isAdmin) {
    return <div>You do not have permission to manage users.</div>;
  }

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        User Management
      </h1>
      {shop && (
        <div>
          <h2>Shop: {shop.name}</h2>
          <h3>Category: {shop.category}</h3>
        </div>
      )}
      <button onClick={addUser} style={{ margin: '8px', padding: '8px 16px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Add User
      </button>
      <h2>Staff Members</h2>
      <ul>
        {users.staff.length > 0 ? users.staff.map(user => (
          <li key={user.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {user.name} - {user.role}
            <button onClick={() => changeRole(user.id, user.role === 'staff' ? 'admin' : 'staff')} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Change Role
            </button>
            <button onClick={() => removeUser(user.id)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Remove
            </button>
          </li>
        )) : <li>No staff members found for this shop.</li>}
      </ul>
      <h2>Shoppers</h2>
      <ul>
        {users.shoppers.length > 0 ? users.shoppers.map(user => (
          <li key={user.id} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {user.name} - {user.role}
            <button onClick={() => changeRole(user.id, user.role === 'shopper' ? 'staff' : 'shopper')} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Change Role
            </button>
            <button onClick={() => removeUser(user.id)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Remove
            </button>
          </li>
        )) : <li>No shoppers found.</li>}
      </ul>
    </div>
  );
};

export default UserManagement;
