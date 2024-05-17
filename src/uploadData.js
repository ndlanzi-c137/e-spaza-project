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

uploadData();
