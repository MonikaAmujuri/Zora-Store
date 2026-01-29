import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getProducts, saveProducts } from "../utils/productStorage";
import "./AdminPanel.css";

function AdminPanel() {
  /* -------------------- STATE -------------------- */
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
    image: "",
    category: "pattu",
    discount: 0,      // ✅ NEW
    stock: 10
  });



  /* -------------------- URL CATEGORY FILTER -------------------- */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get("category");
  const filterType = searchParams.get("filter");

  /* -------------------- LOAD PRODUCTS -------------------- */
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  /* -------------------- FILTER PRODUCTS -------------------- */
  let filteredProducts = [...products];
  // Products on Sale filter (from dashboard)
  if (filterType === "onsale") {
    filteredProducts = filteredProducts.filter(
      (p) => p.discount && p.discount > 0
    );
  }


  // 1️⃣ Category filter (from dashboard or navbar)
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === categoryFilter
    );
  }

  // 2️⃣ Dashboard filters
  if (filterType === "new") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    filteredProducts = filteredProducts.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= sevenDaysAgo
    );
  }

  if (filterType === "outofstock") {
    filteredProducts = filteredProducts.filter(
      (p) => p.stock === 0
    );
  }

  /* -------------------- HELPERS -------------------- */
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      desc: "",
      image: "",
      category: "pattu",
    });
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;

    let updated;

    if (editingId) {
      updated = products.map((p) =>
        p.id === editingId ? { ...p, ...form } : p
      );
    } else {
      updated = [
        ...products,
        {
          ...form,
          id: Date.now(),
          stock: 10,
          createdAt: new Date().toISOString() // ✅ REQUIRED
        }
      ];

    }


    setProducts(updated);
    saveProducts(updated);
    resetForm();
  };


  const handleEdit = (product) => {
    setForm(product);
    setPreview(product.image);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h1>Products</h1>
        {/* TOP ACTION BAR */}
        <div className="admin-top-bar">

          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
            />

            <select
              value={categoryFilter || ""}
              onChange={(e) => {
                const value = e.target.value;

                if (value) {
                  navigate(`/admin/products?category=${value}`);
                } else {
                  navigate("/admin/products");
                }
              }}
            >
              <option value="">All Categories</option>
              <option value="pattu">Pattu Sarees</option>
              <option value="fancy">Fancy Sarees</option>
              <option value="cotton">Cotton Sarees</option>
              <option value="work">Work Sarees</option>
              <option value="dresses">Dresses</option>      
              <option value="croptops">Crop Tops</option> 
            </select>

          </div>

          <button
            className="add-product-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Product
          </button>

        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="admin-card">
          <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: Number(e.target.value) })
            }
          />


          <textarea
            placeholder="Description"
            value={form.desc}
            onChange={(e) =>
              setForm({ ...form, desc: e.target.value })
            }
          />
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="pattu">Pattu Sarees</option>
            <option value="fancy">Fancy Sarees</option>
            <option value="cotton">Cotton Sarees</option>
            <option value="work">Work Sarees</option>
            <option value="dresses">Dresses</option>      
            <option value="croptops">Crop Tops</option>
          </select>


          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();

              reader.onloadend = () => {
                setPreview(reader.result);
                setForm({
                  ...form,
                  image: reader.result // ✅ base64 saved
                });
              };

              reader.readAsDataURL(file);

            }}
          />

          {preview && (
            <img src={preview} className="preview-img" />
          )}

          <div className="admin-actions">
            <button className="save-btn" onClick={handleSave}>
              {editingId ? "Update Product" : "Add Product"}
            </button>

            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="admin-products-grid">
        {filteredProducts.length === 0 && (
          <p className="empty-text">No products found</p>
        )}
        

        {filteredProducts.map((p) => {
          const finalPrice =
            p.discount > 0
              ? Math.round(p.price - (p.price * p.discount) / 100)
              : p.price;
          if (filterType === "onsale") {
            filteredProducts = filteredProducts.filter(
              (p) => p.discount > 0
            );
          }


          return (
            <div className="admin-product-card" key={p.id}>
              <img src={p.image} alt={p.name} />

              <div className="card-info">
                <h4>{p.name}</h4>
                <p>{p.desc}</p>

                <span className="price">
                  ₹ {finalPrice}
                  {p.discount > 0 && <del> ₹ {p.price}</del>}
                </span>

                {p.discount > 0 && (
                  <span className="discount-badge">
                    {p.discount}% OFF
                  </span>
                )}

                <small>{p.category}</small>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button
                  className="danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default AdminPanel;
