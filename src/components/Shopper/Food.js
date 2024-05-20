import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useStateValue } from "./StateProvider.js";

const Food = () => {
  const { categoryName } = useParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map((doc) => doc.data());
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchFoods = async () => {
      try {
        const foodCollection = collection(db, "data");
        const foodSnapshot = await getDocs(foodCollection);
        const foodList = foodSnapshot.docs.map((doc) => doc.data());
        setFoods(foodList);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchCategories();
    fetchFoods();
  }, []);

  const filterType = (category) => {
    setFoods(foods.filter((item) => item.category === category));
  };

  const filterPrice = (price) => {
    setFoods(foods.filter((item) => item.price === price));
  };

  const addToCart = (id, title, image, price) => {
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

  const filteredFoods = categoryName
    ? foods.filter((food) => food.category === categoryName)
    : foods;

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  const handleAllClick = () => {
    navigate("/shopperdashboard");
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
        Products
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={handleAllClick}
          style={{
            margin: "0 8px",
            padding: "8px 16px",
            backgroundColor: "#2ECC40",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            style={{
              margin: "0 8px",
              padding: "8px 16px",
              backgroundColor: "#2ECC40",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 200px))",
          gap: "24px",
          paddingTop: "16px",
          justifyContent: "center",
        }}
      >
        {filteredFoods.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
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
              </p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
