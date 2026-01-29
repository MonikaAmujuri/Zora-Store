import { useState } from "react";
import "./AdminSettings.css";

function AdminSettings() {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* TABS */}
      <div className="settings-tabs">
        <button
          className={activeTab === "store" ? "active" : ""}
          onClick={() => setActiveTab("store")}
        >
          Store
        </button>

        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>

        <button
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>

      {/* CONTENT */}
      <div className="settings-card">

        {/* STORE SETTINGS */}
        {activeTab === "store" && (
          <>
            <h3>Store Settings</h3>

            <label>Store Name</label>
            <input type="text" defaultValue="ZORA" />

            <label>Support Email</label>
            <input type="email" defaultValue="support@zora.com" />

            <label>Currency</label>
            <select>
              <option>₹ INR</option>
              <option>$ USD</option>
              <option>€ EUR</option>
            </select>

            <label>Tax (%)</label>
            <input type="number" defaultValue="5" />

            <div className="toggle-row">
              <input type="checkbox" />
              <span>Maintenance Mode</span>
            </div>

            <button className="save-btn">Save Store Settings</button>
          </>
        )}

        {/* PAYMENTS SETTINGS */}
        {activeTab === "payments" && (
          <>
            <h3>Payment Settings</h3>

            <div className="toggle-row">
              <input type="checkbox" defaultChecked />
              <span>Enable Cash on Delivery</span>
            </div>

            <div className="toggle-row">
              <input type="checkbox" />
              <span>Enable UPI Payments</span>
            </div>

            <div className="toggle-row">
              <input type="checkbox" />
              <span>Enable Card Payments</span>
            </div>

            <label>Payment Gateway Key</label>
            <input type="text" placeholder="Razorpay / Stripe Key" />

            <button className="save-btn">Save Payment Settings</button>
          </>
        )}

        {/* NOTIFICATIONS SETTINGS */}
        {activeTab === "notifications" && (
          <>
            <h3>Notification Settings</h3>

            <div className="toggle-row">
              <input type="checkbox" defaultChecked />
              <span>Email on New Order</span>
            </div>

            <div className="toggle-row">
              <input type="checkbox" />
              <span>Email on Order Status Change</span>
            </div>

            <div className="toggle-row">
              <input type="checkbox" defaultChecked />
              <span>Low Stock Alerts</span>
            </div>

            <button className="save-btn">Save Notification Settings</button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
