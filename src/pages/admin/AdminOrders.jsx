import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderApi";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders().then(setOrders);
  }, []);
  const updateStatus = (id, newStatus) => {
    const updated = orders.map(o =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };
  const updateOrderStatus = async (orderId, status) => {
  await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
};


  return (
    <div className="orders-page">
      <h1 className="page-title">Orders</h1>

      <div className="orders-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-text">
                  No orders found
                </td>
              </tr>
            )}

            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id}</td>
                <td>{order.userEmail}</td>

                <td className="items-cell">
                  {order.items.map(i => (
                    <div key={i.name}>
                      {i.name} × {i.qty}
                    </div>
                  ))}
                </td>

                <td>₹ {order.total}</td>

                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>

                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>
                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN")
                    : "—"}
                </td>

                <td>
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      await updateOrderStatus(order._id, newStatus);
                      fetchAllOrders(); // reload list
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
