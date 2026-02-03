import { useEffect, useState } from "react";
import { fetchUserOrders } from "../../services/orderApi";
import { Link } from "react-router-dom";
import UserHeader from "../../components/user/UserHeader";
import "./MyOrders.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    useEffect(() => {
        fetchUserOrders(user.email).then(setOrders);
    }, []);

    const cancelOrder = async (orderId) => {
        await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Cancelled" }),
        });

        fetchUserOrders(); // refresh list
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
                        <div className="order-card" key={order._id}>
                            <div className="order-left">
                                <p className="order-id">Order #{order._id}</p>
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
                                <Link to={`/order/${order._id}`} className="view-btn">
                                    View Details →
                                </Link>
                                {order.status === "Pending" && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        Cancel Order
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
