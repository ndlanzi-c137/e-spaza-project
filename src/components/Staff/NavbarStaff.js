import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose, AiFillTag } from "react-icons/ai";
import { BsFillCartFill, BsFillSaveFill } from "react-icons/bs";
import { FaUserFriends, FaWallet } from "react-icons/fa";
import { MdFavorite, MdHelp } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useStateValue } from "../Shopper/StateProvider";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [categories, setCategories] = useState([]);
  const [{ basket }, dispatch] = useStateValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map((doc) => doc.data());
      setCategories(categoriesList);
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        maxWidth: "1640px",
        margin: "auto",
        padding: "16px",
        backgroundColor: "#fcf9f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div onClick={() => setNav(!nav)} style={{ cursor: "pointer" }}>
          <AiOutlineMenu size={30} style={{ color: "#2ECC40" }} />
        </div>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#2ECC40",
            paddingLeft: "15px",
            margin: "0",
          }}
        >
          E-Spaza - Staff Dashboard
        </h1>
      </div>

      {/* Search Input */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        <div
          style={{
            background: " #c7eec9",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            padding: "8px 20%",
            width: "200px",
          }}
        >
          <AiOutlineSearch size={25} style={{ color: "#2ECC40" }} />
          <input
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              marginLeft: "8px",
              width: "100%",
            }}
            type="text"
            placeholder="Search"
          />
        </div>
      </div>


      {/* Mobile Menu */}
      {/* Overlay */}
      {nav && (
        <div
          style={{
            background: "#fcf9f9",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        ></div>
      )}

      {/* Side drawer menu */}
      <div
        style={{
          background: "#fff",
          position: "fixed",
          top: 0,
          left: nav ? 0 : "-100%",
          width: "300px",
          height: "100%",
          zIndex: 10,
          transitionDuration: "300ms",
        }}
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          style={{
            color: "#2ECC40",
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: "pointer",
          }}
        />
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#2ECC40",
            paddingLeft: "16px",
            margin: "16px 0",
          }}
        >
          E-Spaza
        </h2>
        <nav>
          <ul style={{ listStyle: "none", padding: "0", color: "#2ECC40" }}>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TbTruckDelivery size={25} style={{ marginRight: "8px" }} />{" "}
              Orders
            </li>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MdFavorite size={25} style={{ marginRight: "8px" }} /> Favorites
            </li>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaWallet size={25} style={{ marginRight: "8px" }} /> Wallet
            </li>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MdHelp size={25} style={{ marginRight: "8px" }} /> Help
            </li>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AiFillTag size={25} style={{ marginRight: "8px" }} /> Promotions
            </li>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <BsFillSaveFill size={25} style={{ marginRight: "8px" }} /> Best
              Ones
            </li>
            <li
              style={{
                fontSize: "1rem",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaUserFriends size={25} style={{ marginRight: "8px" }} /> Invite
              Friends
            </li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
