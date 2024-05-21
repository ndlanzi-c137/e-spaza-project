import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Subtotal.css";
import CurrentFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { uploadOrders } from "../../uploadData";  

function Subtotal() {
  const [{ basket }, dispatch] = useStateValue();
  const [orderStatus, setOrderStatus] = useState("");
  const navigate = useNavigate();

  const proceedToCheckout = async () => {
    const shopperId = "2ECoi9W7ImPCvYEor8B6p63ZCpB2";  // Replace with actual shopper ID
    const shopId = "O59samwwsqT9dl0paYo6tWIPWY72";    
    const result = await uploadOrders(basket, shopperId, shopId);

    if (result.success) {
      // Clear the basket
      dispatch({
        type: "CLEAR_BASKET",
      });
      // Navigate to Order Status page
    } else {
      // Display error message
      setOrderStatus(result.message);
    }
  };

  return (
    <div className="subtotal">
      <CurrentFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal({basket.length} items):<strong>{value}</strong>
            </p>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"R"}
      />
      <button className="checkout__page" onClick={proceedToCheckout}>Proceed to Checkout</button>
      {orderStatus && <p className="order__status">{orderStatus}</p>}
    </div>
  );
}

export default Subtotal;
