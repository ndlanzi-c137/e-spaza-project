import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; 
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const ordersCollection = collection(db, "orders");
          const q = query(ordersCollection, where("shopperId", "==", user.uid)); 
          const ordersSnapshot = await getDocs(q);
          const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersList);
        } catch (error) {
          console.error("Error fetching orders: ", error);
          setError("Failed to fetch orders.");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="orderHistory">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order">
            <h3>Order ID: {order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Total: R{order.total}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.name} - {item.quantity} x R{item.price}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
