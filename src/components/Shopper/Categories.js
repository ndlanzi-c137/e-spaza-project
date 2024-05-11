import React from "react";
import { categories } from "../../data/data.js";

const Category = () => {
  console.log(categories);
  return (
    <div style={{ maxWidth: "1640px", margin: "auto", padding: "0 4px 12px" }}>
      <h1
        style={{
          color: "#2ECC40",
          fontWeight: "bold",
          fontSize: "2.5rem",
          textAlign: "center",
        }}
      >
        Categories
      </h1>
      {/* Categories */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "24px",
          padding: "10px 0",
          justifyContent: "center",
          transition: "transform 0.3s ease",
          ":hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        {categories.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              flexDirection: "column", // Adjust direction to stack items vertically
              alignItems: "center", // Align items to the center
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "80px", marginBottom: "8px" }}
            />
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: "#000000",
                textAlign: "center", // Center-align the text
              }}
            >
              {item.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
