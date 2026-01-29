import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "../../components/user/UserHeader";
import "./MyOrders.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

        // 🔐 later you can filter by logged-in user email
        setOrders(storedOrders.reverse());
    }, []);

    const cancelOrder = (orderId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        const updatedOrders = orders.map((order) =>
            order.id === orderId
                ? { ...order, status: "Cancelled" }
                : order
        );

        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
    };


    return (
        <div className="my-orders-page">
            <UserHeader/>

    <section className="listing-section">

      {/* HEADER */}
      <div className="listing-header">
        <h2 className="page-title">My Orders</h2>
        <p className="page-subtitle">
          Track and manage your recent purchases
        </p>
        <div className="title-divider"></div>
      </div>

      {/* ORDERS */}
      {orders.length === 0 ? (
        <p className="empty-text">You haven’t placed any orders yet</p>
      ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-left">
                                <p className="order-id">Order #{order.id}</p>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="order-center">
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                                <span className="order-total">₹ {order.total}</span>
                            </div>

                            <div className="order-right">
                                <Link to={`/order/${order.id}`} className="view-btn">
                                    View Details →
                                </Link>

                                {order.status === "Pending" && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => cancelOrder(order.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            )}
            </section>
        </div>
    );
}

export default MyOrders;
