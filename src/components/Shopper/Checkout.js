import React from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import Navbar from './NavbarShopper';

function Checkout() {
  const [{ basket }, dispatch] = useStateValue();

  return (
    <div style={{ backgroundColor: '#fcf9f9' }}>
    <Navbar />
    <div className="checkout" style={{backgroundColor: '#fcf9f9'}}>
      
      <div className="checkout__left">
        <div>
          <h2 className="checkout__title">Your shopping Basket</h2>
          {basket.map((item) => (
            <CheckoutProduct
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image || item.imageUrl}
              price={item.price} 
            />
          ))}
        </div>
      </div>
      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
    </div>
  );
}

export default Checkout;
