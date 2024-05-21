import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState({ staff: [], shoppers: [] });
  const [shop, setShop] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
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
              fetchShoppers();
            } else {
              console.log('No shop found for this admin.');
            }
          } else {
            console.log('No user document found.');
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchUsers = async (adminId) => {
      try {
        console.log('Fetching staff members for adminId:', adminId);
        const q = query(collection(db, 'users'), where('shopId', '==', adminId), where('role', '==', 'staff'));
        const usersSnapshot = await getDocs(q);
        const usersList = usersSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        console.log('Fetched staff members:', usersList);
        setUsers(prevUsers => ({ ...prevUsers, staff: usersList }));
      } catch (error) {
        console.error('Error fetching staff members:', error);
      }
    };

    const fetchShoppers = async () => {
      try {
        console.log('Fetching all shoppers');
        const q = query(collection(db, 'users'), where('role', '==', 'shopper'));
        const shoppersSnapshot = await getDocs(q);
        const shoppersList = shoppersSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        console.log('Fetched shoppers:', shoppersList);
        setUsers(prevUsers => ({ ...prevUsers, shoppers: shoppersList }));
      } catch (error) {
        console.error('Error fetching shoppers:', error);
      }
    };

    fetchCurrentUser();
  }, [auth]);

  const removeUser = async (userId) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers({
        staff: users.staff.filter(user => user.docId !== userId),
        shoppers: users.shoppers.filter(user => user.docId !== userId)
      });
      toast.success('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
  };

  const changeRole = async (userId, currentRole) => {
    if (!isAdmin) return;
    console.log(`Changing role for user ID: ${userId} from ${currentRole}`);
    const newRole = currentRole === 'staff' ? 'shopper' : 'staff';
    const userDocRef = doc(db, 'users', userId); // Using the Firestore document ID directly
    console.log(`Document reference: ${userDocRef.path}`);
    try {
      const updateData = { role: newRole };
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();
      if (newRole === 'staff' && !userData.shopId) {
        updateData.shopId = shop.adminId;
      }
      await updateDoc(userDocRef, updateData);
      setUsers(prevUsers => ({
        staff: prevUsers.staff.map(user => user.docId === userId ? { ...user, role: newRole } : user),
        shoppers: prevUsers.shoppers.map(user => user.docId === userId ? { ...user, role: newRole } : user)
      }));
      toast.success('User role changed successfully');
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error('Failed to change user role');
    }
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
      <h2>Staff Members</h2>
      <ul>
        {users.staff.length > 0 ? users.staff.map(user => (
          <li key={user.docId} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {user.name} - {user.role}
            <button onClick={() => changeRole(user.docId, user.role)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Change Role
            </button>
            <button onClick={() => removeUser(user.docId)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Remove
            </button>
          </li>
        )) : <li>No staff members found for this shop.</li>}
      </ul>
      <h2>Shoppers</h2>
      <ul>
        {users.shoppers.length > 0 ? users.shoppers.map(user => (
          <li key={user.docId} style={{ marginBottom: '8px', listStyle: 'none' }}>
            {user.name} - {user.role}
            <button onClick={() => changeRole(user.docId, user.role)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#2ECC40', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Change Role
            </button>
            <button onClick={() => removeUser(user.docId)} style={{ marginLeft: '8px', padding: '4px 8px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Remove
            </button>
          </li>
        )) : <li>No shoppers found.</li>}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
