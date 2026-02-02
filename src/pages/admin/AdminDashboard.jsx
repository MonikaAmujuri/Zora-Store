import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../utils/productStorage";
import SalesGraph from "../../components/admin/SalesGraph";
import "./AdminDashboard.css";


function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  // 🔹 Stats
  const totalProducts = products.length;
  const productsOnSale = products.filter(p => p.discount > 0).length;
  const pattuCount = products.filter(p => p.category === "pattu").length;
  const fancyCount = products.filter(p => p.category === "fancy").length;
  const cottonCount = products.filter(p => p.category === "cotton").length;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const ordersCount = orders.length;
  



  // 🔹 Recent Products (latest 5)
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 🔴 Out of stock products
  const outOfStockProducts = products.filter(
    (p) => p.stock === 0
  );


  return (
    <div className="admin-dashboard">

      {/* ================= STATS CARDS ================= */}
      <div className="stats-grid">
        <div className="stat-card purple" onClick={() => navigate("/admin/products")}>
          <p>Total Products</p>
          <h2>{totalProducts}</h2>
        </div>

        <div className="stat-card red" onClick={() => navigate("/admin/products?category=pattu")}>
          <p>Pattu Sarees</p>
          <h2>{pattuCount}</h2>
        </div>

        <div className="stat-card blue" onClick={() => navigate("/admin/products?category=fancy")}>
          <p>Fancy Sarees</p>
          <h2>{fancyCount}</h2>
        </div>

        <div className="stat-card green" onClick={() => navigate("/admin/products?category=cotton")}>
          <p>Cotton Sarees</p>
          <h2>{cottonCount}</h2>
        </div>

        <div className="stat-card purple"
          onClick={() => navigate("/admin/users")}
        >
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>
        <div
          className="stat-card orange"
          onClick={() => navigate("/admin/orders")}
        >
          <p>Orders</p>
          <h2>{ordersCount}</h2>
        </div>
        <div
          className="stat-card orange clickable"
          onClick={() =>
            navigate("/admin/products?filter=onsale")
          }
        >
          <p>Products on Sale</p>
          <h2>{productsOnSale}</h2>
        </div>
        



      </div>

      {/* ================= RECENT PRODUCTS TABLE ================= */}
      <div className="dashboard-card">
        <h3>Recent Products</h3>

        {recentProducts.length === 0 ? (
          <p>No recent products</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Added On</th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹ {p.price}</td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <SalesGraph orders={orders} />
      
      {/* ================= OUT OF STOCK TABLE ================= */}
      <div className="dashboard-card danger-card">
        <div className="table-header">
          <h3>Out of Stock</h3>

          <button
            className="view-all-btn"
            onClick={() => navigate("/admin/products?filter=outofstock")}
          >
            View All
          </button>
        </div>

        {outOfStockProducts.length === 0 ? (
          <p className="success-text">✅ All products are in stock</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {outOfStockProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹ {p.price}</td>
                  <td>
                    <span className="status-badge danger">
                      Out of Stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


    </div>
  );
}

export default AdminDashboard;
