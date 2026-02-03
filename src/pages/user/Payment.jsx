import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckoutSteps from "../../components/user/CheckoutSteps";
import { createOrder } from "../../services/orderApi";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const address = JSON.parse(localStorage.getItem("selectedAddress"));
  const [selectedPayment, setSelectedPayment] = useState("");


  const adminSettings = JSON.parse(
  localStorage.getItem("adminSettings")
);

const payments = adminSettings?.payments || {
  cod: false,
  upi: false,
  card: false,
};


  /* TOTAL CALCULATION */
  const total = cart.reduce(
  (sum, item) => sum + item.finalPrice * item.qty,
  0
);


  /* PLACE ORDER */

const placeOrder = async () => {
  if (!address || cart.length === 0) {
    alert("Missing address or cart");
    return;
  }

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const newOrder = {
    userEmail: user.email,
    items: cart.map(item => ({
      productId: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      finalPrice: item.finalPrice,
      discount: item.discount,
      qty: item.qty,
    })),
    address,
    total,
    paymentMethod: "COD",
  };

  try {
    const savedOrder = await createOrder(newOrder);

    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/order-success");
  } catch (err) {
    alert("Order failed");
  }
};

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      <CheckoutSteps step={3} />

      {/* ADDRESS SUMMARY */}
      <div className="summary-card">
        <h3>Deliver To</h3>
        <p><strong>{address?.name}</strong></p>
        <p>{address?.street}</p>
        <p>{address?.city} - {address?.pincode}</p>
        <p>{address?.phone}</p>
      </div>

      {/* ORDER SUMMARY */}
      <div className="summary-card">
        <h3>Order Summary</h3>
        {cart.map(item => (
          <p key={item._id}>
            {item.name} × {item.qty} — ₹ {item.price * item.qty}
          </p>
        ))}
        <hr />
        <h3>Total: ₹ {total}</h3>
      </div>

      {/* PAYMENT METHOD */}
      <div className="summary-card">
        <h3>Select Payment Method</h3>
        <div className="payment-methods"></div>
        {payments.cod && (
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === "cod"}
              onChange={() => setSelectedPayment("cod")}
            />
            Cash on Delivery
          </label>
        )}

        {payments.upi && (
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={selectedPayment === "upi"}
              onChange={() => setSelectedPayment("upi")}
            />
            UPI Payment
          </label>
        )}

        {payments.card && (
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={selectedPayment === "card"}
              onChange={() => setSelectedPayment("card")}
            />
            Credit / Debit Card
          </label>
        )}

        {selectedPayment === "upi" && (
  <div className="upi-box">
    <p className="upi-title">Scan & Pay via UPI</p>

    <img
      src="/upi-qr.png"
      alt="UPI QR Code"
      className="upi-qr"
    />

    <p className="upi-note">
      Use Google Pay / PhonePe / Paytm
    </p>
  </div>
)}


  {/* If no payment enabled */}
  {!payments.cod && !payments.upi && !payments.card && (
    <p className="no-payment">
      ⚠️ No payment methods available. Please contact support.
    </p>
  )}
      </div>

      <button className="place-order-btn" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Payment;
