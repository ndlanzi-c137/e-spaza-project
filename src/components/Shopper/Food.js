<<<<<<< HEAD
import React, { useState } from "react";
import { data } from "../../data/data.js";
import { useStateValue } from "./StateProvider.js";
=======
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
>>>>>>> 258941d227436367138f28f3f837cb35b4b9b135

const Food = () => {
  const { categoryName } = useParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

<<<<<<< HEAD
  // Filter Type burgers/pizza/etc
  const filterType = (category) => {
    setFoods(data.filter((item) => item.category === category));
  };

  // Filter by price
  const filterPrice = (price) => {
    setFoods(data.filter((item) => item.price === price));
  };

  const [basket, dispatch] = useStateValue();
  console.log("This is the basket>>>", basket);
  const addToCart = (id, title, image, price) => {
    //dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_CART",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
      },
    });
  };

  return (
    <div style={{ maxWidth: "1640px", margin: "auto", padding: "16px" }}>
      <h1
        style={{
          color: "#2ECC40",
          fontWeight: "bold",
          fontSize: "2.5rem",
          textAlign: "center",
        }}
      >
        Popular Products
      </h1>

      {/* Filter Row */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        {/* Filter Type */}
        <div>
          <p style={{ fontWeight: "bold", color: "#000000" }}>Filter Type</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setFoods(data)}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              All
            </button>
            <button
              onClick={() => filterType("basic foods")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Basics
            </button>
            <button
              onClick={() => filterType("canned foods")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Canned Foods
            </button>
            <button
              onClick={() => filterType("dairy")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Dairy
            </button>
            <button
              onClick={() => filterType("toiletries")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Toiletries
            </button>
          </div>
        </div>

        {/* Filter Price */}
        <div>
          <p style={{ fontWeight: "bold", color: "#000000" }}>Filter Price</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              maxWidth: "390px",
              width: "100%",
            }}
          >
            <button
              onClick={() => filterPrice("$")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              $
            </button>
            <button
              onClick={() => filterPrice("$$")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              $$
            </button>
            <button
              onClick={() => filterPrice("$$$")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              $$$
            </button>
            <button
              onClick={() => filterPrice("$$$$")}
              style={{
                margin: "4px",
                border: "1px solid #2ECC40",
                color: "#2ECC40",
                padding: "4px 8px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              $$$$
            </button>
          </div>
        </div>
      </div>

      {/* Display foods */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 200px))",
          gap: "24px",
          paddingTop: "16px",
          justifyContent: "center",
        }}
      >
        {foods.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            />

            <div
              style={{
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontWeight: "bold" }}>{item.name}</p>
              <p>
                <span
                  style={{
                    backgroundColor: "#2ECC40",
                    color: "white",
                    padding: "4px",
                    borderRadius: "9999px",
                  }}
                >
                  R{item.price}
                </span>
                <button
                  className="add__toCart"
                  style={{
                    marginTop: "50px",
                    padding: "15px",
                    color: "white",
                    backgroundColor: "#2ECC40",
                    border: "1px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                  }}
                  onClick={() =>
                    addToCart(item.id, item.name, item.image, item.price)
                  }
                >
                  Add to cart
                </button>
              </p>
=======
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchFoods = async () => {
      try {
        const foodCollection = collection(db, 'data');
        const foodSnapshot = await getDocs(foodCollection);
        const foodList = foodSnapshot.docs.map(doc => doc.data());
        setFoods(foodList);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchCategories();
    fetchFoods();
  }, []);

  const filteredFoods = categoryName
    ? foods.filter((food) => food.category === categoryName)
    : foods;

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  const handleAllClick = () => {
    navigate('/shopperdashboard');
  };

  return (
    <div style={{ maxWidth: '1640px', margin: 'auto', padding: '16px' }}>
      <h1 style={{ color: '#2ECC40', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Products
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <button onClick={handleAllClick} style={{ margin: '0 8px', padding: '8px 16px', backgroundColor: '#2ECC40', color: 'white', border: 'none', borderRadius: '4px' }}>
          All
        </button>
        {categories.map((category, index) => (
          <button key={index} onClick={() => handleCategoryClick(category.name)} style={{ margin: '0 8px', padding: '8px 16px', backgroundColor: '#2ECC40', color: 'white', border: 'none', borderRadius: '4px' }}>
            {category.name}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 200px))', gap: '24px', paddingTop: '16px', justifyContent: 'center' }}>
        {filteredFoods.map((item, index) => (
          <div key={index} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontWeight: 'bold' }}>{item.name}</p>
              <p><span style={{ backgroundColor: '#2ECC40', color: 'white', padding: '4px', borderRadius: '9999px' }}>R{item.price}</span></p>
>>>>>>> 258941d227436367138f28f3f837cb35b4b9b135
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
