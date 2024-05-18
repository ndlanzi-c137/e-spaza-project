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

//uploadData();
addOrders();
