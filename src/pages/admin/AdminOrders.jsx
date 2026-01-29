import { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = orders.map(o =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
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
              <tr key={order.id}>
                <td>#{order.id}</td>
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
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
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
