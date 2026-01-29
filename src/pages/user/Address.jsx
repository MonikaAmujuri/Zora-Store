import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/user/CheckoutSteps";
import "./Address.css";

function Address() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    pincode: "",
    phone: "",
  });

  /* LOAD SAVED ADDRESSES */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(saved);
    if (saved.length > 0) {
      setSelectedId(saved[0].id);
    }
  }, []);

  /* ADD NEW ADDRESS */
  const addAddress = () => {
    if (!form.name || !form.street || !form.city || !form.pincode || !form.phone) {
      alert("Please fill all address fields");
      return;
    }

    const newAddress = {
      id: Date.now(),
      ...form,
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setSelectedId(newAddress.id);

    setForm({
      name: "",
      street: "",
      city: "",
      pincode: "",
      phone: "",
    });
  };

  /* CONTINUE TO PAYMENT */
  const continueToPayment = () => {
    const selected = addresses.find(a => a.id === selectedId);
    if (!selected) {
      alert("Please select an address");
      return;
    }

    localStorage.setItem("selectedAddress", JSON.stringify(selected));
    navigate("/payment");
  };

  return (
    <div className="address-page">
      <h2>Delivery Address</h2>
      <CheckoutSteps step={2} />

      {/* SAVED ADDRESSES */}
      {addresses.map(addr => (
        <label key={addr.id} className="address-card">
          <input
            type="radio"
            checked={selectedId === addr.id}
            onChange={() => setSelectedId(addr.id)}
          />
          <div>
            <strong>{addr.name}</strong>
            <p>{addr.street}</p>
            <p>{addr.city} - {addr.pincode}</p>
            <p>{addr.phone}</p>
          </div>
        </label>
      ))}

      {/* ADD NEW ADDRESS */}
      <div className="add-address">
        <h3>Add New Address</h3>

        <input placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Street"
          value={form.street}
          onChange={e => setForm({ ...form, street: e.target.value })} />

        <input placeholder="City"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })} />

        <input placeholder="Pincode"
          value={form.pincode}
          onChange={e => setForm({ ...form, pincode: e.target.value })} />

        <input placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })} />

        <button onClick={addAddress}>Save Address</button>
      </div>

      <button className="continue-btn" onClick={continueToPayment}>
        Continue to Payment →
      </button>
    </div>
  );
}

export default Address;
