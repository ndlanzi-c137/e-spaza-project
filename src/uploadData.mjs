// uploadData.js
import { db } from './firebaseConfig.js';
import { data, categories, shops } from './data/data.js';

const uploadData = async () => {
  try {
    const batch = db.batch();

    data.forEach((item) => {
      const docRef = db.collection('items').doc();
      batch.set(docRef, item);
    });

    categories.forEach((category) => {
      const docRef = db.collection('categories').doc();
      batch.set(docRef, category);
    });

    shops.forEach((shop) => {
      const docRef = db.collection('shops').doc();
      batch.set(docRef, shop);
    });

    await batch.commit();
    console.log('Data uploaded successfully');
  } catch (error) {
    console.error('Error uploading data: ', error);
  }
};

uploadData();
