import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/user/CheckoutSteps";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const address = JSON.parse(localStorage.getItem("selectedAddress"));

  /* TOTAL CALCULATION */
  const total = cart.reduce(
  (sum, item) => sum + item.finalPrice * item.qty,
  0
);


  /* PLACE ORDER */
  const placeOrder = () => {
    if (!address || cart.length === 0) {
      alert("Missing address or cart");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: cart,
      address,
      total,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    /* USER ORDERS */
    const userOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...userOrders, newOrder]));

    /* ADMIN ORDERS */
    const adminOrders = JSON.parse(localStorage.getItem("adminOrders")) || [];
    localStorage.setItem("adminOrders", JSON.stringify([...adminOrders, newOrder]));

    /* CLEAR CART */
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/order-success");
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
          <p key={item.id}>
            {item.name} × {item.qty} — ₹ {item.price * item.qty}
          </p>
        ))}
        <hr />
        <h3>Total: ₹ {total}</h3>
      </div>

      {/* PAYMENT METHOD */}
      <div className="summary-card">
        <h3>Payment Method</h3>
        <label>
          <input type="radio" checked readOnly /> Cash on Delivery
        </label>
      </div>

      <button className="place-order-btn" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Payment;
