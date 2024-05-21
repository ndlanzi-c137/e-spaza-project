// uploadData.js
import { db } from './firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore';
import { data, categories, shops } from './data/data.js';

const uploadData = async () => {
  try {
    const dataCollection = collection(db, 'data');
    const categoriesCollection = collection(db, 'categories');
    const shopsCollection = collection(db, 'shops');

    // Upload data items
    for (const item of data) {
      await addDoc(dataCollection, item);
    }

    // Upload categories items
    for (const item of categories) {
      await addDoc(categoriesCollection, item);
    }

    // Upload shops items
    for (const item of shops) {
      await addDoc(shopsCollection, item);
    }

    console.log('Data uploaded successfully!');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const addOrders = async () => {
  const ordersCollection = collection(db, 'orders');
  
  // Define the shopper ID
  const shopperId = "2ECoi9W7ImPCvYEor8B6p63ZCpB2";
  const shopId = "O59samwwsqT9dl0paYo6tWIPWY72";
  
  // Define the orders
  const orders = [
    {
      shopperId: shopperId,
      shopId: shopId,
      items: [
        { name: "Amasi", quantity: 4, price: 20 },
      ],
      total: 40,
      status: "pending",
      createdAt: new Date()
    },

  ];

  try {
    // Add each order to the Firestore collection
    for (const order of orders) {
      await addDoc(ordersCollection, order);
    }
    console.log("Orders successfully added.");
  } catch (e) {
    console.error("Error adding orders: ", e);
  }
};

// Add this function to uploadData.js
const uploadOrders = async (basket, shopperId, shopId) => {
  const ordersCollection = collection(db, 'orders');

  const order = {
    shopperId: shopperId,
    shopId: shopId,
    items: basket.map(item => ({
      name: item.title,
      quantity: 1,
      price: item.price,
    })),
    total: basket.reduce((total, item) => total + item.price, 0),
    status: "pending",
    createdAt: new Date(),
  };

  try {
    await addDoc(ordersCollection, order);
    console.log("Order successfully added.");
    return { success: true, message: "Order placed successfully!" };
  } catch (e) {
    console.error("Error adding order: ", e);
    return { success: false, message: "Error placing order. Please try again." };
  }
};


//uploadData();
//addOrders();

export { uploadOrders };
