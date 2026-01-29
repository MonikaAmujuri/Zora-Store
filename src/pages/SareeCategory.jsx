import { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import "../components/ProductCard/ProductCard.css";

function SareeCategory({ title }) {
  const isAdmin = true;

  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      name: `${title} Design 1`,
      price: "₹9,999",
      desc: "Premium quality saree"
    },
    {
      id: 2,
      image: "",
      name: `${title} Design 1`,
      price: "₹9,999",
      desc: "Premium quality saree"

    }
  ]);

  const updateProduct = (updated) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>{title}</h2>

      <div className="product-grid">
        {products.map(p => (
          <ProductCard
          key={p.id}
          product={p}
          onUpdate={updateProduct}
          />

        ))}
      </div>
    </div>
  );
}

export default SareeCategory;
