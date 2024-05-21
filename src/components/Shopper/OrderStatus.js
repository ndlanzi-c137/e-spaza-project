import React from "react";
import { useLocation } from "react-router-dom";

function OrderStatus() {
  const location = useLocation();
  const { statusMessage } = location.state || {};

  return (
    <div className="orderStatus">
      <h2>Order Status</h2>
      <p>{statusMessage}</p>
      {/* Additional details about the order can be displayed here */}
    </div>
  );
}

export default OrderStatus;
